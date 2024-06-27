let boxBuscar = document.querySelector('.buscar-box');
let lupa = document.querySelector('.lupa-buscar');
let btnFechar = document.querySelector('.btn-fechar');

lupa.addEventListener('click', ()=>{
    boxBuscar.classList.add('ativar')
})

btnFechar.addEventListener('click', ()=>{
    boxBuscar.classList.remove('ativar')
})

document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cart-items');
  const deliveryFee = 15.00;
  const cartTotalElement = document.getElementById('cart-total');
  const totalWithDeliveryElement = document.getElementById('total-with-delivery');
  

  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', event => {
      const productElement = event.target.closest('.coluna-16');
      const productTitle = productElement.querySelector('.product-title').textContent;
      const productPrice = parseFloat(productElement.querySelector('.product-price').textContent.replace('R$', '').replace(',', '.'));
      if(addItemToCart(productTitle, productPrice)){
       alert(`Produto "${productTitle}" adicionado ao carrinho por R$${productPrice.toFixed(2).replace('.', ',')}`);
       
    }
      updateCart();
    });
    
  });


  function addItemToCart(title, price) {
    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ title, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    return true;
  }

  function updateCart() {
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = '';
      let total = 0;
      cart.forEach(item => {
        const cartRow = document.createElement('tr');
        cartRow.classList.add('cart-product');
        cartRow.innerHTML = `
          <td class="product-identification">
            <strong class="cart-product-title">${item.title}</strong>
          </td>
          <td>
            <span class="cart-product-price">R$${item.price.toFixed(2).replace('.', ',')}</span>
          </td>
          <td>
            <input type="number" value="${item.quantity}" min="0" class="product-qtd-input">
            <button type="button" class="remove-product-button">Remover</button>
          </td>
        `;
        cartItemsContainer.appendChild(cartRow);

        cartRow.querySelector('.remove-product-button').addEventListener('click', () => {
          removeItemFromCart(item.title);
          updateCart();
        });

        cartRow.querySelector('.product-qtd-input').addEventListener('change', (event) => {
          const newQuantity = event.target.valueAsNumber;
          if (newQuantity > 0) {
            item.quantity = newQuantity;
          } else {
            removeItemFromCart(item.title);
          }
          updateCart();
        });

        total += item.price * item.quantity;
      });

      cartTotalElement.textContent = `R$${total.toFixed(2).replace('.', ',')}`;
      const totalWithDelivery = total + deliveryFee;
      totalWithDeliveryElement.textContent = `R$${totalWithDelivery.toFixed(2).replace('.', ',')}`;
    }
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
  }
}

  function removeItemFromCart(title) {
    const itemIndex = cart.findIndex(item => item.title === title);
    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  if (cartItemsContainer) {
    updateCart();
  }
});

document.getElementById("finalizarCompraBtn").addEventListener("click", function() {
  window.location.href = "pagamentoC.html";
});

document.addEventListener('DOMContentLoaded', function () {
  var pixOption = document.getElementById('pix');
  var comprovanteUpload = document.getElementById('upload-comprovante');

  var radioButtons = document.querySelectorAll('input[name="payment"]');
  radioButtons.forEach(function(radio) {
      radio.addEventListener('change', function() {
          if (pixOption.checked) {
              comprovanteUpload.style.display = 'block';
          } else {
              comprovanteUpload.style.display = 'none';
          }
      });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.finalize-btn').addEventListener('click', function() {
      const carrinho = obterConteudoDoCarrinho(); // Função para obter o conteúdo do carrinho
      
      fetch('http://localhost:3000/finalizar-pagamento', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ carrinho: carrinho })
      })
      .then(response => {
          if (response.ok) {
              alert('Compra finalizada com sucesso!');
          } else {
              throw new Error('Erro ao finalizar compra');
          }
      })
      .catch(error => {
          console.error('Erro:', error);
          alert('Erro ao finalizar compra');
      });
  });
});
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'seu-email@gmail.com',
      pass: 'sua-senha'
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var pixOption = document.getElementById('pix');
  var comprovanteUpload = document.getElementById('upload-comprovante');

  var radioButtons = document.querySelectorAll('input[name="payment"]');
  radioButtons.forEach(function(radio) {
      radio.addEventListener('change', function() {
          if (pixOption.checked) {
              comprovanteUpload.style.display = 'block';
          } else {
              comprovanteUpload.style.display = 'none';
          }
      });
  });

  document.getElementById('finalizePaymentBtn').addEventListener('click', function() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length === 0) {
          alert('Seu carrinho está vazio!');
          return;
      }

      const email = "cooporprodutosorganicos@gmail.com"; // Substitua pelo seu email de envio

      const emailContent = cart.map(item => `${item.title} - Quantidade: ${item.quantity}, Preço: R$${item.price.toFixed(2).replace('.', ',')}`).join('\n');

      fetch('/send-email', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email, items: emailContent })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Email enviado com sucesso!');
          } else {
              alert('Falha ao enviar email.');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Erro ao enviar email.');
      });
  });
});

function logar(){
  var email = document.getElementById('email').value;
  var senha = document.getElementById('senha').value;

  if(email == "Raquel" && senha == "maede3ks"){
    alert('Sucesso');
    location.href = "carrinho.html";
  }else{
    alert('Usuário ou senha incorretos');
 }


}

function cadastrar() {
  window.location.href = 'cadastro.html';
}