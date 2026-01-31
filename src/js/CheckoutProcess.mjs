// CheckoutProcess.mjs
import {
  getLocalStorage,
  setLocalStorage,
  alertMessage,
  removeAllAlerts,
} from "./utils.mjs";

const baseURL = (
  import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com"
).replace(/\/$/, "");

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.itemCount = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
    this.setInitialSummaryValues();
  }

  setInitialSummaryValues() {
    const summaryContainer = document.querySelector(this.outputSelector);
    if (!summaryContainer) return;

    const taxElem = summaryContainer.querySelector("#order-tax");
    const shippingElem = summaryContainer.querySelector("#order-shipping");
    const totalElem = summaryContainer.querySelector("#order-total");

    if (taxElem) {
      taxElem.innerHTML = `<span class="summary-item">Tax:</span> <span class="summary-value">$0.00</span>`;
    }
    if (shippingElem) {
      shippingElem.innerHTML = `<span class="summary-item">Shipping:</span> <span class="summary-value">$0.00</span>`;
    }
    if (totalElem) {
      totalElem.innerHTML = `<span class="summary-item">Order Total:</span> <span class="summary-value">$0.00</span>`;
    }
  }

  calculateItemSubTotal() {
    let subtotal = 0;
    let count = 0;

    this.list.forEach((item) => {
      const quantity = item.quantity ? Number(item.quantity) : 1;
      count += quantity;

      const price = item.FinalPrice !== undefined ? Number(item.FinalPrice) : 0;
      subtotal += price * quantity;
    });

    this.itemTotal = subtotal;
    this.itemCount = count;

    const subtotalElem = document.querySelector(
      `${this.outputSelector} #order-subtotal`
    );
    if (subtotalElem) {
      subtotalElem.innerHTML = `<span class="summary-item">Subtotal:</span> <span class="summary-value">$${this.itemTotal.toFixed(
        2
      )}</span>`;
    }
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.itemCount > 0 ? 10 + (this.itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const summaryContainer = document.querySelector(this.outputSelector);
    if (!summaryContainer) return;

    const taxElem = summaryContainer.querySelector("#order-tax");
    const shippingElem = summaryContainer.querySelector("#order-shipping");
    const totalElem = summaryContainer.querySelector("#order-total");

    if (taxElem) {
      taxElem.innerHTML = `<span class="summary-item">Tax:</span> <span class="summary-value">$${this.tax.toFixed(
        2
      )}</span>`;
    }
    if (shippingElem) {
      shippingElem.innerHTML = `<span class="summary-item">Shipping:</span> <span class="summary-value">$${this.shipping.toFixed(
        2
      )}</span>`;
    }
    if (totalElem) {
      totalElem.innerHTML = `<span class="summary-item">Order Total:</span> <span class="summary-value">$${this.orderTotal.toFixed(
        2
      )}</span>`;
    }
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice !== undefined ? Number(item.FinalPrice) : 0,
      quantity: item.quantity ? Number(item.quantity) : 1,
    }));
  }

  async checkout(form) {
    const rawOrderData = formDataToJSON(form);

    const orderData = {
      orderDate: new Date().toISOString(),
      fname: rawOrderData["first-name"],
      lname: rawOrderData["last-name"],
      street: rawOrderData["street-address"],
      city: rawOrderData.city,
      state: rawOrderData.state,
      zip: rawOrderData["zip-code"],
      cardNumber: rawOrderData["credit-card"],
      expiration: rawOrderData["exp-date"],
      code: rawOrderData.cvv,
      items: this.packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    };

    try {
      const response = await fetch(`${baseURL}/checkout`, options);

      if (!response.ok) {
        throw { name: "Server error", message: response.status };
      }

      const result = await response.json();

      setLocalStorage("so-cart", []);
      location.assign("/checkout/success.html");
      return result;
    } catch (error) {
      console.log(error);
      removeAllAlerts();
      alertMessage(`${error.name} ${error.message}`);
    }
  }
}
