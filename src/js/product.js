import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Initialize data source and get productId from URL
const dataSource = new ExternalServices("tents");
const productId = getParam("product");

// Set up product details and initialize UI
const productDetails = new ProductDetails(productId, dataSource);
productDetails.init();

// Set the productId as a data attribute on the Add to Cart button
const addToCartBtn = document.getElementById("addToCart");
addToCartBtn.setAttribute("data-id", productId);
console.log("Button data-id:", addToCartBtn.dataset.id);

// Function to add product to cart (implement this function based on your cart logic)
function addProductToCart(product) {
  // Example implementation - you should replace this with your real cart logic
  console.log("Product added to cart:", product);
  alert(`Added "${product.Name}" to cart!`);
}

// Handler for Add to Cart button click
async function addToCartHandler(e) {
  const id = e.target.dataset.id;
  console.log("Adding product with ID:", id);

  if (!id) {
    alert("No product ID found!");
    return;
  }

  const product = await dataSource.findProductById(id);
  console.log("Found product:", product);

  if (!product) {
    alert("Product not found!");
    return;
  }

  addProductToCart(product);
  loadHeaderFooter();
}

// Add event listener to Add to Cart button
addToCartBtn.addEventListener("click", addToCartHandler);

// Call it once on page load:
loadHeaderFooter();
