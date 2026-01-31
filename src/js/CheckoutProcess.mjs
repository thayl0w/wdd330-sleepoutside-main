
// CheckoutProcess.mjs
import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from './utils.mjs';

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
        this.key = key; // localStorage key for the cart, e.g., 'so-cart'
        this.outputSelector = outputSelector; // CSS selector for the container holding your order summary
        this.list = [];
        this.itemTotal = 0;   // Dollar value of all items
        this.itemCount = 0;   // Total number of items (counts quantity)
        this.tax = 0;
        this.shipping = 0;
        this.orderTotal = 0;
    }

    // Call this method when the page loads to get the cart summary.
    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
        this.setInitialSummaryValues();
    }

    setInitialSummaryValues() {
        const summaryContainer = document.querySelector(this.outputSelector);
        if (!summaryContainer) return;

        const taxElem = summaryContainer.querySelector('#order-tax');
        const shippingElem = summaryContainer.querySelector('#order-shipping');
        const totalElem = summaryContainer.querySelector('#order-total');

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

    // Calculate the subtotal for all items and update the item count.
    calculateItemSubTotal() {
        let subtotal = 0;
        let count = 0;

        // Loop through each item in the stored cart.
        this.list.forEach(item => {
            const quantity = item.quantity ? Number(item.quantity) : 1;
            count += quantity;

            const price = item.FinalPrice !== undefined ? Number(item.FinalPrice) : 0;
            subtotal += price * quantity;
        });

        this.itemTotal = subtotal;
        this.itemCount = count;

        // Update the subtotal in the order summary
        const subtotalElem = document.querySelector(`${this.outputSelector} #order-subtotal`);
        if (subtotalElem) {
            subtotalElem.innerHTML = `<span class="summary-item">Subtotal:</span> <span class="summary-value">$${this.itemTotal.toFixed(2)}</span>`;
        }
    }

    // Calculate tax, shipping, and the overall order total.
    // Tax: 6% of the subtotal.
    // Shipping: $10 for the first item plus $2 for each additional item.
    calculateOrderTotal() {
        console.log("calculateOrderTotal() method called.");

        this.tax = this.itemTotal * 0.06;
        this.shipping = this.itemCount > 0 ? 10 + ((this.itemCount - 1) * 2) : 0;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        console.log("Tax computed: ", this.tax);
        console.log("Shipping computed: ", this.shipping);
        console.log("Order total computed: ", this.orderTotal);

        this.displayOrderTotals();
    }


    // Update the order summary elements on the checkout page.
    displayOrderTotals() {
        const summaryContainer = document.querySelector(this.outputSelector);
        if (!summaryContainer) return;

        const taxElem = summaryContainer.querySelector('#order-tax');
        const shippingElem = summaryContainer.querySelector('#order-shipping');
        const totalElem = summaryContainer.querySelector('#order-total');

        if (taxElem) {
            taxElem.innerHTML = `<span class="summary-item">Tax:</span> <span class="summary-value">$${this.tax.toFixed(2)}</span>`;
        }
        if (shippingElem) {
            shippingElem.innerHTML = `<span class="summary-item">Shipping:</span> <span class="summary-value">$${this.shipping.toFixed(2)}</span>`;
        }
        if (totalElem) {
            totalElem.innerHTML = `<span class="summary-item">Order Total:</span> <span class="summary-value">$${this.orderTotal.toFixed(2)}</span>`;
        }

    }


    packageItems(items) {
        return items.map(item => ({
            id: item.Id, 
            name: item.Name, 
            price: item.FinalPrice !== undefined ? Number(item.FinalPrice) : 0,
            quantity: item.quantity ? Number(item.quantity) : 1
        }));
    }



    async checkout(form) {
        // Convert form data to JSON
        const rawOrderData = formDataToJSON(form);

        // Fix key names to match the server’s expectations
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
            code: rawOrderData.cvv, // Fixes "cvv" → "code"
            items: this.packageItems(this.list),
            orderTotal: this.orderTotal.toFixed(2),
            shipping: this.shipping,
            tax: this.tax.toFixed(2),
        };

        console.log("Prepared Order Data:", orderData);

        // Set up fetch
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData) // Convert object to JSON
        };

        try {
            const response = await fetch("https://wdd330-backend.onrender.com/checkout", options);

            
            if (!response.ok) {
               
                throw {name: "Server error", message: response.status}
            }
            
            const result = await response.json();
            
            console.log("Order submitted successfully:", result);

            setLocalStorage("so-cart", []);
            location.assign("/checkout/success.html");
            return result;

        } catch (error) {
        
            console.log(error)
            removeAllAlerts();
            for (let message in error) {
                console.log(message)
                alertMessage(`${error.name} ${error.message}`);
            }
        }
        
    }



}