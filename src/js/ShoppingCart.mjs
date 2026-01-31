import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ShoppingCart {
  async init() {
    // Wait for DOM ready if needed or just call renderCartContents directly
    renderCartContents();
  }
}

function cartItemTemplate(item) {
  const image = item.Image || (item.Images && item.Images.PrimarySmall) || "/images/placeholder.png";
  const name = item.Name || "Unnamed product";
  const colorName =
    item.Colors && item.Colors.length > 0 && item.Colors[0].ColorName
      ? item.Colors[0].ColorName
      : "No color info";
  const quantity = item.quantity || 1;
  const price = item.FinalPrice !== undefined ? Number(item.FinalPrice) : 0;
  const totalPrice = (price * quantity).toFixed(2);
  
  // Pick unique id, fallback to Name
  // Ensure it's a string, just in case
  const id = String(item.Id || item.id || item.Name);

  return `<li class="cart-card divider" data-id="${id}">
      <button class="remove-item" data-id="${id}" aria-label="Remove ${name} from cart">X</button>
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
  const productListEl = document.querySelector(".product-list");
  const cartFooterEl = document.querySelector(".cart-footer");
  const cartTotalEl = document.querySelector(".cart-total");

  if (!productListEl || !cartFooterEl || !cartTotalEl) {
    console.error("Cart DOM elements not found!");
    return;
  }

  if (cartItems.length === 0) {
    productListEl.innerHTML = "There are no items in your cart.";
    cartFooterEl.style.display = "none";
    return;
  }

  const validItems = cartItems.filter(
    (item) => item && (item.Name || item.Image),
  );
  if (validItems.length === 0) {
    productListEl.innerHTML = "There are no valid items in your cart.";
    cartFooterEl.style.display = "none";
    return;
  }

  // Render cart items.
  const htmlItems = validItems.map(cartItemTemplate);
  productListEl.innerHTML = htmlItems.join("");
  cartFooterEl.style.display = "block";

  // Calculate and display total
  let total = 0;
  for (const item of validItems) {
    const quantity = item.quantity || 1;
    total += (Number(item.FinalPrice) || 0) * quantity;
  }
  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;

  // Insert the Checkout button below the total (but before the page footer).
  // Adjust this markup and styling as needed.
  const checkoutMarkup = `
  <div class="checkout-container" style="text-align: center; margin-top: 1rem;">
    <button class="checkout-btn" onclick="window.location.href='/checkout/index.html'">
      Checkout
    </button>
  </div>
`;

  cartTotalEl.insertAdjacentHTML("afterend", checkoutMarkup);

  // Attach event listeners to remove buttons
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const id = button.dataset.id;
      console.log("Remove clicked for id:", id);

      let updatedCart = getLocalStorage("so-cart") || [];

      // Make sure id comparison is string to string
      updatedCart = updatedCart.filter(
        (item) => String(item.Id || item.id || item.Name) !== id,
      );

      setLocalStorage("so-cart", updatedCart);

      // Re-render the cart after removal
      renderCartContents();
    });
  });
}
