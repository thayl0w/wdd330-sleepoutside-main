import { getLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  const image = item.Image || "/images/placeholder.png"; // fallback image
  const name = item.Name || "Unnamed product";
  const colorName =
    item.Colors && item.Colors.length > 0 && item.Colors[0].ColorName
      ? item.Colors[0].ColorName
      : "No color info";
  const quantity = item.quantity || 1;
  const price = item.FinalPrice !== undefined ? Number(item.FinalPrice) : 0;
  const totalPrice = (price * quantity).toFixed(2);

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${image}" alt="${name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${name}</h2>
    </a>
    <p class="cart-card__color">${colorName}</p>
    <p class="cart-card__quantity">qty: ${quantity}</p>
    <p class="cart-card__price">$${totalPrice}</p>
  </li>`;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  if (cartItems.length > 0) {
    // Filter invalid items
    const validItems = cartItems.filter(item => item && (item.Name || item.Image));
    if (validItems.length === 0) {
      document.querySelector(".product-list").innerHTML = "There are no valid items in your cart.";
      document.querySelector(".cart-footer").style.display = "none";
      return;
    }

    const htmlItems = validItems.map(cartItemTemplate);
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
    document.querySelector(".cart-footer").style.display = "block";

    let total = 0;
    for (const item of validItems) {
      const quantity = item.quantity || 1;
      total += (Number(item.FinalPrice) || 0) * quantity;
    }
    document.querySelector(".cart-total").textContent = `Total: $${total.toFixed(2)}`;
  } else {
    document.querySelector(".product-list").innerHTML = "There are no items in your cart.";
    document.querySelector(".cart-footer").style.display = "none";
  }
}

function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const count = cartItems.length;
  const badge = document.querySelector(".cart-count-badge");

  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }
}

renderCartContents();
updateCartCount();

export { updateCartCount };