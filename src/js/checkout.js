import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

// Initialize the checkout process.
const checkout = new CheckoutProcess("so-cart", "#checkout");
checkout.init();

// 🚀 Add Checkout Submission Listener
document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.querySelector("#checkout-form");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent default form submission

      // Call checkout function and handle response
      const orderResponse = await checkout.checkout(checkoutForm);
      console.log("Order Server Response:", orderResponse);
    });
  }
});

// Expiration Date Auto-Formatting
document.addEventListener("DOMContentLoaded", () => {
  const expDateInput = document.querySelector("#exp-date");

  if (expDateInput) {
    expDateInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

      if (value.length > 1) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`; // Ensures "/" remains in place
      }

      e.target.value = value;
    });
  }
});

// Zip Code Event Listener for Order Total Calculation
const zipInput = document.querySelector("#zip-code");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    checkout.calculateOrderTotal();
  });
}
