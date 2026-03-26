/* ===============================
   SERVICE WORKER
================================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("service-worker.js");
      console.log("Service Worker Registered ✅");
    } catch (err) {
      console.log("SW failed:", err);
    }
  });

  navigator.serviceWorker.ready.then(reg => {
    if (reg.active) {
      reg.active.postMessage({ action: "skipWaiting" });
    }
  });
}

/* ===============================
   GET / SAVE CART & WISHLIST
================================= */
function getCart(){
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getWishlist(){
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist){
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

/* ===============================
   UPDATE COUNTS
================================= */
function updateCartCount(){
  const cart = getCart();
  let total = 0;
  cart.forEach(item => total += item.qty);

  const badge = document.getElementById("cart-count");
  if(badge){
    badge.innerText = total;
  }
}

function updateWishlistCount(){
  const wishlist = getWishlist();
  const badge = document.getElementById("wishlist-count");
  if(badge){
    badge.innerText = wishlist.length; 
  }
}

/* ===============================
   TOAST POPUP 
================================= */
function showToast(message){
  const toast = document.getElementById("toast");
  if(!toast) return;

  if(message) {
      toast.innerText = message;
  }

  toast.classList.add("show");
  setTimeout(()=>{
    toast.classList.remove("show");
  }, 2000);
}

/* ===============================
   ADD TO CART
================================= */
window.addToCart = function(name, price, image, size = null){
  let cart = getCart();
  let existing = cart.find(item => item.name === name && item.size === size);

  if(existing){
    existing.qty += 1;
    if(!existing.image) existing.image = image;
  } else {
    cart.push({ name: name, price: price, qty: 1, image: image, size: size });
  }

  saveCart(cart);
  updateCartCount();
  showToast(name + " added to cart 🛒");
}

/* ===============================
   ADD TO WISHLIST
================================= */
window.addToWishlist = function(name, price, image){
  let wishlist = getWishlist();
  let existing = wishlist.find(item => item.name === name);

  if(!existing){
    wishlist.push({ name: name, price: price, image: image });
    saveWishlist(wishlist);
    updateWishlistCount(); 
    showToast(name + " added to wishlist ❤️");
  } else {
    showToast(name + " is already in your wishlist ❤️");
  }
}

/* ===============================
   MOVE FROM WISHLIST TO CART
================================= */
window.moveFromWishlistToCart = function(index) {
  let wishlist = getWishlist();
  let item = wishlist[index];

  // 1. Add it to the cart
  addToCart(item.name, item.price, item.image);

  // 2. Remove it from the wishlist
  wishlist.splice(index, 1);
  saveWishlist(wishlist);

  // 3. Update the page
  renderWishlist();
  updateWishlistCount();
}

/* ===============================
   CART & WISHLIST CONTROLS
================================= */
window.increaseQty = function(index){
  let cart = getCart();
  cart[index].qty += 1;
  saveCart(cart);
  renderCart();
  updateCartCount();
}

window.decreaseQty = function(index){
  let cart = getCart();
  if(cart[index].qty > 1){
    cart[index].qty -= 1;
  }else{
    cart.splice(index,1);
  }
  saveCart(cart);
  renderCart();
  updateCartCount();
}

window.removeItem = function(index){
  let cart = getCart();
  cart.splice(index,1);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

window.removeFromWishlist = function(index){
  let wishlist = getWishlist();
  wishlist.splice(index, 1);
  saveWishlist(wishlist);
  renderWishlist();
  updateWishlistCount(); 
  showToast("Item removed from wishlist 💔");
}

/* ===============================
   RENDER CART
================================= */
function renderCart(){
  const cartDiv = document.getElementById("cart-items");
  if(!cartDiv) return;

  let cart = getCart();
  let total = 0;
  let totalItems = 0;
  let cartHTML = "";

  if(cart.length === 0){
    cartDiv.innerHTML = `
      <div style="text-align:center; padding: 50px;">
        <h2>Your cart is empty!</h2><br>
        <button class="continue-btn" onclick="goHome()" style="padding: 10px 20px; font-size: 16px;">⬅ Continue Shopping</button>
      </div>`;
    return;
  }

  cartHTML += `<div class="cart-layout"><div class="cart-left"><h2>Your Cart 🛒</h2>`;

  cart.forEach((item,index)=>{
    let itemTotal = item.price * item.qty;
    total += itemTotal;
    totalItems += item.qty;
    let imgSrc = item.image ? item.image : "images/default.jpg";
    let displaySize = item.size ? item.size : "Not Selected";

    cartHTML += `
      <div class="cart-card">
        <img src="${imgSrc}" class="cart-img" alt="${item.name}">
        <div class="cart-details">
          <h4>${item.name}</h4>
          <p>Price: ₹${item.price}</p>
          <p>Size: <b>${displaySize}</b></p> 
          <div class="qty-box">
            <button onclick="decreaseQty(${index})">−</button>
            <span>${item.qty}</span>
            <button onclick="increaseQty(${index})">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        </div>
        <div class="cart-price">₹${itemTotal}</div>
      </div>
    `;
  });

  cartHTML += `
    </div>
    <div class="cart-right">
      <h3>Order Summary</h3>
      <p>Total Items: ${totalItems}</p>
      <h2>Subtotal: ₹${total}</h2>
      <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
      <button class="continue-btn bottom-btn" onclick="goHome()">⬅ Continue Shopping</button>
    </div>
  </div>`;

  cartDiv.innerHTML = cartHTML;
}

/* ===============================
   RENDER WISHLIST
================================= */
function renderWishlist(){
  const wishlistDiv = document.getElementById("wishlist-items");
  if(!wishlistDiv) return;

  let wishlist = getWishlist();
  let wishlistHTML = "";

  if(wishlist.length === 0){
    wishlistDiv.innerHTML = `
      <div style="text-align:center; padding: 50px;">
        <h2>Your Wishlist is empty ❤️</h2><br>
        <button class="continue-btn" onclick="goHome()" style="padding: 10px 20px; font-size: 16px;">⬅ Continue Shopping</button>
      </div>`;
    return;
  }

  wishlistHTML += `
  <div class="cart-layout">
    <div class="cart-left">
      <h2>Your Wishlist ❤️</h2>
  `;

  wishlist.forEach((item, index) => {
    let imgSrc = item.image ? item.image : "images/default.jpg";
    
    wishlistHTML += `
      <div class="cart-card">
        <img src="${imgSrc}" class="cart-img" alt="${item.name}">
        
        <div class="cart-details">
          <h4>${item.name}</h4>
          <p>Price: ₹${item.price}</p>
          
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="cart-btn" onclick="moveFromWishlistToCart(${index})" style="margin: 0; padding: 8px 20px; border-radius: 20px;">
              Add to Cart
            </button>
            <button class="remove-btn" onclick="removeFromWishlist(${index})" style="margin: 0; background: #e0e0e0; color: #333; border-radius: 20px; padding: 8px 20px;">
              Remove
            </button>
          </div>
        </div>

        <div class="cart-price">₹${item.price}</div>
      </div>
    `;
  });

  wishlistHTML += `
    </div>
    
    <div class="cart-right">
      <h3>Wishlist Summary</h3>
      <p>Saved Items: ${wishlist.length}</p>
      
      <button class="continue-btn bottom-btn" onclick="goHome()" style="margin-top: 20px;">
        ⬅ Continue Shopping
      </button>
    </div>
  </div>`;

  wishlistDiv.innerHTML = wishlistHTML;
}

/* ===============================
   CHECKOUT (UPDATED)
================================= */
window.checkout = function(){
  let cart = getCart();
  if(cart.length === 0){
    alert("Cart is empty!");
    return;
  }
  // Send the user to the checkout page
  window.location.href = "checkout.html";
}

/* ===============================
   NAVIGATION
================================= */
window.goToCart = function(){
  window.location.href = "cart.html";
}

window.goHome = function(){
  window.location.href = "index.html";
}

/* ===============================
   LOAD INITIALIZERS
================================= */
window.addEventListener("load", function(){
  renderCart();
  renderWishlist(); 
  updateCartCount();
  updateWishlistCount(); 
});

document.addEventListener("DOMContentLoaded", function(){
  updateCartCount();
  updateWishlistCount(); 
});