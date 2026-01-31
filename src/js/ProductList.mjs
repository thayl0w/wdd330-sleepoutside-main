import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const discount = product.SuggestedRetailPrice > product.FinalPrice ? Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) /
          product.SuggestedRetailPrice) * 100): null;

  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
      ${
        discount !== null
          ? `<div class="discount-container">
                <img src="../images/discount-star.png" alt="Discount Star" class="discount-image">
                <span class="discount-text">${discount}% OFF</span>
              </div>`
          : ""
      }
          </a>
        </li>`;
      }


export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData(this.category);
        this.renderList(list);
    }
 
  renderList(list) {
    document.querySelector("#top-products").innerHTML = `Top Products: ${this.category.charAt(0).toUpperCase()}${ this.category.slice(1)} `
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}