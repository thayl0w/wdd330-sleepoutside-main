import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    };

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        document
            .getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    };

    addProductToCart() {
      const cartItems = getLocalStorage("so-cart") || [];
      if (isIn(this.product, cartItems)) {
        console.log("already in")
        
      } else {
        this.product.quantity = 1;
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
      }

      function isIn(product, cartItems) {
        for (const item of cartItems) {
          console.log(item);
          console.log(product);
          if (item.Id === product.Id) {
            item.quantity += 1;
            setLocalStorage("so-cart", cartItems);
            return true;
          }
        }
      }
    };

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const carousel = document.getElementById("productCarousel");
  const thumbnails = document.getElementById("carouselThumbnails");

  // Clear existing content
  carousel.innerHTML = "";
  thumbnails.innerHTML = "";

  // Combine Primary and ExtraImages
  const allImages = [
    product.Images.PrimaryLarge,
    ...(product.Images?.ExtraImages?.map(img => img.Src) || [])
  ];

  // Render main carousel images
  allImages.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = product.NameWithoutBrand;
    img.classList.add("carousel-image");
    if (index === 0) img.classList.add("active");
    carousel.appendChild(img);

    // Render thumbnails
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.alt = `Thumbnail ${index + 1}`;
    thumb.classList.add("carousel-thumb");
    if (index === 0) thumb.classList.add("selected");

    thumb.addEventListener("click", () => {
      // Toggle active image
      document.querySelectorAll(".carousel-image").forEach((img, idx) => {
        img.classList.toggle("active", idx === index);
      });

      // Toggle selected thumbnail
      document.querySelectorAll(".carousel-thumb").forEach((thumb, idx) => {
        thumb.classList.toggle("selected", idx === index);
      });
    });

    thumbnails.appendChild(thumb);
  });

  // Other product details
  document.getElementById("productPrice").textContent = `$${product.FinalPrice.toFixed(2)}`;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = product.Id;
  const discount = product.SuggestedRetailPrice > product.FinalPrice
    ? Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100)
    : null;

  if (discount !== null && carousel) {
    const discountContainer = document.createElement("div");
    discountContainer.classList.add("discount-container-details");

    discountContainer.innerHTML = `
      <img src="/images/discount-star.png" alt="Discount Star" class="discount-image-details">
      <span class="discount-text-details">${discount}% OFF</span>`;

    carousel.appendChild(discountContainer);
  }
}