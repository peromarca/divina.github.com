// Dohvati DOM elemente
const categoryList = document.getElementById('category-list');
const productList = document.getElementById('product-list');
const currentCategory = document.getElementById('current-category');
const welcomeSection = document.getElementById('welcome-section');
const cartCount = document.getElementById('cart-count');
console.log(data);
// Košarica
let cart = {};

// Klik na kategoriju
categoryList.addEventListener('click', (e) => {
   const li = e.target.closest('li');
   if (!li) return;

   const categoryName = li.dataset.category;
   const category = data.categories.find(c => c.name === categoryName);

   if (!category) return;

   currentCategory.textContent = category.name;
   productList.innerHTML = '';

   category.products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';

      productCard.innerHTML = ` <div class="product-image-container"> <img src="${product.image}" alt="${product.name}"> <span class="cart-quantity-overlay" style="display: none;">0</span> </div> <h3>${product.name}</h3><div class="cart-hover-icon" title="Dodaj u košaricu">🛒</div>  `;

      const cartIcon = productCard.querySelector('.cart-hover-icon');
      cartIcon.addEventListener('click', () => {
         addToCart(product);
      });

      productList.appendChild(productCard);
   });
});

// Dodavanje u košaricu
function addToCart(product) {
   if (!cart[product.name]) {
      cart[product.name] = {
         ...product,
         quantity: 1
      };
   } else {
      cart[product.name].quantity += 1;
   }

   updateCartCount();
   updateProductOverlay(product);
   saveCartToStorage();
}

// Ažuriranje brojke u ikoni košarice
function updateCartCount() {
   const total = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
   cartCount.textContent = total;

}

// Lokalno spremanje košarice (za cart.html)
function saveCartToStorage() {
   localStorage.setItem('divina_cart', JSON.stringify(cart));
}
function updateProductOverlay(product) {
   const productCards = productList.querySelectorAll('.product-card');
   productCards.forEach(card => {
      const img = card.querySelector('img');
      if (img && img.alt === product.name) {
         const overlay = card.querySelector('.cart-quantity-overlay');
         if (overlay) {
            const qty = cart[product.name].quantity; overlay.textContent = qty;
            overlay.style.display = qty > 0 ? 'flex' : 'none';
         }
      }
   });
}
// Učitavanje košarice kad se stranica otvori
function loadCart() {
   const saved = localStorage.getItem('divina_cart');
   if (saved) {
      cart = JSON.parse(saved);
      updateCartCount();
   }
}


loadCart();
currentCategory.textContent = category.name;
document.getElementById('current-category-container').style.display = 'block';
