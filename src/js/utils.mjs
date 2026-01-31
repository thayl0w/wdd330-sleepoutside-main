// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(templateFn, parentElement, list, position='afterbegin', clear = false) {
  const htmlStrings = list.map(templateFn);
  if(clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(
  template,
  parentElement,
  callback
) {
  parentElement.innerHTML = template;
  if (callback) {
    callback();
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const headerElement = document.querySelector("#main-header");
  renderWithTemplate(headerTemplate, headerElement, updateCartCount);

  const footerTemplate = await loadTemplate("../partials/footer.html");
  const footerElement = document.querySelector("#footer");
  renderWithTemplate(footerTemplate, footerElement, updateCartCount);

}


//----Cart Subscript----//

// Retrieve cart contents from localStorage
function getCartContents() {
  const cart = localStorage.getItem("so-cart");
  return cart ? JSON.parse(cart) : [];
}

// Update the number shown on the cart icon
function updateCartCount() {
  const cartItems = getCartContents();
  const cartLink = document.querySelector(".cart-link");

  if (!cartLink) return;

  // Check if the badge already exists
  let badge = cartLink.querySelector(".cart-count-badge");

  if (!badge) {
    // Create the badge if it doesn't exist
    badge = document.createElement("span");
    badge.classList.add("cart-count-badge");
    cartLink.appendChild(badge);
  }

  // Reduce item quantities
    const quantity = cartItems.reduce((pv, item) => {
      return pv + item.quantity;
    }, 0);

  // Update the count
  badge.textContent = quantity;

  // Optional: Hide badge if cart is empty
  if (cartItems.length === 0) {
    badge.style.display = "none";
  } else {
    badge.style.display = "inline-block";
  }
}

//Alert Message Pop-up
export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      main.removeChild(this);
    }
  });

  const main = document.querySelector("main");
  main.prepend(alert)

  if (scroll)
    window.scrollTo(0, 0);
}


export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}