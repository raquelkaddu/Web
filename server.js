const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura o body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Endpoint para renderizar o formulário
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'forgot-password.html'));
});

// Endpoint para processar o formulário
app.post('/reset-password', (req, res) => {
    const { email } = req.body;

    // Configura o Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use o serviço de e-mail que preferir
        auth: {
            user: 'your-email@gmail.com', // Substitua com seu e-mail
            pass: 'your-email-password'   // Substitua com sua senha
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Redefinição de Senha',
        text: 'Clique no link a seguir para redefinir sua senha: http://localhost:3000/reset-password-link'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Erro ao enviar e-mail');
        } else {
            console.log('E-mail enviado: ' + info.response);
            res.send('E-mail de redefinição de senha enviado');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
