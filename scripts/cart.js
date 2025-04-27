document.addEventListener('DOMContentLoaded', function () {
   const cartItemsContainer = document.getElementById('cart-items-container');
   const cartCount = document.getElementById('cart-count');
   const totalItemsSpan = document.getElementById('total-items');
   const totalPriceSpan = document.getElementById('total-price');

   // Učitaj košaricu iz localStorage
   let cart = JSON.parse(localStorage.getItem('divina_cart')) || {};

   // Prikaz košarice
   function displayCart() {
      cartItemsContainer.innerHTML = '';

      if (Object.keys(cart).length === 0) {
         cartItemsContainer.innerHTML = '<div class="empty-cart">Vaša košarica je prazna</div>';
         updateCartCounters(0, 0);
         return;
      }

      let totalItems = 0;
      let totalPrice = 0;

      Object.entries(cart).forEach(([key, item]) => {
         totalItems += item.quantity;
         totalPrice += item.price * item.quantity;

         const cartItem = document.createElement('div');
         cartItem.className = 'cart-item';
         cartItem.innerHTML = `
                <div class="cart-item-info">
                        <h3>${item.name}</h3>
                  <p>    </p>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="decrease-btn" data-id="${key}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-btn" data-id="${key}">+</button>
                </div>
            `;
         cartItemsContainer.appendChild(cartItem);
      });

      updateCartCounters(totalItems, totalPrice);

      // Dodaj event listenere za gumbe
      document.querySelectorAll('.decrease-btn').forEach(btn => {
         btn.addEventListener('click', decreaseQuantity);
      });
      document.querySelectorAll('.increase-btn').forEach(btn => {
         btn.addEventListener('click', increaseQuantity);
      });
   }

   function updateCartCounters(items, price) {
      cartCount.textContent = items;
      totalItemsSpan.textContent = `Ukupno artikala: ${items}`;
      totalPriceSpan.textContent = price.toFixed(2);
   }

   function decreaseQuantity(e) {
      const itemId = e.target.dataset.id;
      if (cart[itemId].quantity > 1) {
         cart[itemId].quantity -= 1;
      } else {
         delete cart[itemId];
      }
      saveCart();
      displayCart();
   }

   function increaseQuantity(e) {
      const itemId = e.target.dataset.id;
      cart[itemId].quantity += 1;
      saveCart();
      displayCart();
   }

   function saveCart() {
      localStorage.setItem('divina_cart', JSON.stringify(cart));
      // Ažuriraj brojač u headeru na svim stranicama
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);
   }

   // Pratimo promjene košarice na drugim stranicama
   window.addEventListener('cartUpdated', function () {
      cart = JSON.parse(localStorage.getItem('divina_cart')) || {};
      displayCart();
   });

   displayCart();
});