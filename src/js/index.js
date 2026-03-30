import Product from './Product.js';
import httpsErrorCode from "./utils.js";

const BASE_URL = "https://world.openfoodfacts.org/api/v3/product/";
const FIELDS = "nutriments,image_url,product_name_en,quantity";

async function fetchData(productCode) {
  const url = `${BASE_URL}${productCode}?fields=${FIELDS}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === httpsErrorCode.NOT_FOUND) {
      throw new Error("Product not found.");
    }

    if (response.status === httpsErrorCode.INTERNAL_SERVER_ERROR) {
      throw new Error("Server error. Please try again later.");
    }

    if (response.status !== httpsErrorCode.OK) {
      throw new Error(`Unexpected HTTP status: ${response.status}`);
    }

    if (!response.ok) {
      const rawText = await response.text();
      let errorData = null;

      if (rawText) {
        try {
          errorData = JSON.parse(rawText);
        } catch {
          errorData = rawText;
        }
        throw new Error(errorData || `HTTP ${response.status}`);
      }
    }

    return await response.json();
  } catch (err) {
    console.warn("fetchData error:", err);
    return {
      status: "error",
      message: err.message || "Please try again later.",
    };
  }
}

function displayProduct(product) {
  const container = document.getElementById("product");
  container.innerHTML = `
    <h2>${product.name}</h2>
    <img src="${product.imageUrl}" alt="${product.name}" width="500" height="600">
    <div class="nutrient">Energy: ${product.energy} kcal</div>
    <div class="nutrient">Fat: ${product.fat} g</div>
    <div class="nutrient">Saturated Fat: ${product.saturatedFat} g</div>
    <div class="nutrient">Carbohydrates: ${product.carbohydrates} g</div>
    <div class="nutrient">Sugars: ${product.sugars} g</div>
    <div class="nutrient">Fiber: ${product.fiber} g</div>
    <div class="nutrient">Proteins: ${product.proteins} g</div>
    <div class="nutrient">Salt: ${product.salt} g</div>
    <div class="nutrient">Sodium: ${product.sodium} g</div>
    <div class="nutrient">Quantity: ${product.quantity}</div>
  `;
}

function storeLocalStorage(product) {
  let codeBarre = product.codeBarre;

  const productData = {
    code: product.codeBarre,
    product: {
      image_url: product.imageUrl,
      product_name_en: product.name,
      nutriments: {
        energy: product.energy,
        fat: product.fat,
        ['saturated-fat']: product.saturatedFat,
        carbohydrates: product.carbohydrates,
        sugars: product.sugars,
        fiber: product.fiber,
        proteins: product.proteins,
        salt: product.salt,
        sodium: product.sodium,
      },
      quantity: product.quantity,
    },
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(codeBarre, JSON.stringify(productData));
}

function getProductFromLocalStorageIfExist(productCode) {
    const productsStr = localStorage.getItem("products");
    if (!productsStr) return false;
    const products = JSON.parse(productsStr);
    return products[productCode] || false;
}

async function handleFetch(productCode) {
  let product;

  const savedData = getProductFromLocalStorageIfExist(productCode);

  if (savedData != false) {
    product = new Product(savedData);
  } else {
    const data = await fetchData(productCode);
    if (data.status === "success" && data.product) {
      product = new Product(data);
      storeLocalStorage(product);
    } else {
      console.warn("Product not found or API returned an error");
      return null;
    }
  }
  displayProduct(product);
  const slider = document.getElementById("slider");
  const valueDisplay = document.getElementById("value-slider");
  const baseQuantity = parseFloat(product.quantity) || 100;

  slider.min = 0;
  slider.max = baseQuantity * 2;
  slider.value = baseQuantity;
  valueDisplay.textContent = baseQuantity;

  return product;
}

const slider = document.querySelector("#slider");

slider.addEventListener('input', () => {
    document.getElementById("value-slider").textContent = slider.value;
    
    if (!currentProduct) return;

    const desiredQuantity = Number(slider.value);
    const baseQuantity = parseFloat(currentProduct.quantity) || 1;
    const factor = desiredQuantity / baseQuantity;

    const scale = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? "?" : (num * factor).toFixed(2);
    };


    const container = document.getElementById("product");
    container.innerHTML = `
    <h2>${currentProduct.name}</h2>
    <img src="${currentProduct.imageUrl}" alt="${currentProduct.name}" width="300">
    <div class="nutrient">Energy: ${scale(currentProduct.energy)} kcal</div>
    <div class="nutrient">Fat: ${scale(currentProduct.fat)} g</div>
    <div class="nutrient">Saturated Fat: ${scale(currentProduct.saturatedFat)} g</div>
    <div class="nutrient">Carbohydrates: ${scale(currentProduct.carbohydrates)} g</div>
    <div class="nutrient">Sugars: ${scale(currentProduct.sugars)} g</div>
    <div class="nutrient">Fiber: ${scale(currentProduct.fiber)} g</div>
    <div class="nutrient">Proteins: ${scale(currentProduct.proteins)} g</div>
    <div class="nutrient">Salt: ${scale(currentProduct.salt)} g</div>
    <div class="nutrient">Sodium: ${scale(currentProduct.sodium)} g</div>
    <div class="nutrient">Quantity: <span class="quantity-value">${desiredQuantity}</span> g/ml</div>`;
});

let currentProduct = null;

async function init() {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
        currentProduct = await handleFetch(code);
    }
}

init();