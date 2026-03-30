import Product from './Product.js';
import httpsErrorCode from "./utils.js";

const BASE_URL = "https://world.openfoodfacts.org/api/v3/product/";
const FIELDS =
  "nutriments,image_url,product_name_en,quantity";

console.log(httpsErrorCode);

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

  let products = JSON.parse(localStorage.getItem("products")) || {};
  products[codeBarre] = productData;
  localStorage.setItem("products", JSON.stringify(products));

  localStorage.setItem("lastProductCode", codeBarre);
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



function getProductFromLocalStorageIfExist(productCode){
  const productsStr = localStorage.getItem("products");
  
  if (!productsStr) return false;

  const products = JSON.parse(productsStr);

  return products[productCode] || false;
}









const slider = document.querySelector("#slider");

slider.addEventListener('input', () => {
  document.getElementById("value-slider").textContent = slider.value;
  const lastProductCode = localStorage.getItem("lastProductCode");
  if (!lastProductCode) return;

  const products = JSON.parse(localStorage.getItem("products"));
  if (!products || !products[lastProductCode]) return;

  const storedData = products[lastProductCode];
  const product = storedData.product;
  const desiredQuantity = Number(slider.value);

  const baseQuantity = parseFloat(product.quantity) || 1;
  const factor = desiredQuantity / baseQuantity;

  const scale = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "?" : (num * factor).toFixed(2);
  };

  const container = document.getElementById("product");

  container.innerHTML = `
    <h2>${product.product_name_en}</h2>
    <img src="${product.image_url}" alt="${product.product_name_en}" width="500" height="600">
    <div class="nutrient">Energy: ${scale(product.nutriments.energy)} kcal</div>
    <div class="nutrient">Fat: ${scale(product.nutriments.fat)} g</div>
    <div class="nutrient">Saturated Fat: ${scale(product.nutriments['saturated-fat'])} g</div>
    <div class="nutrient">Carbohydrates: ${scale(product.nutriments.carbohydrates)} g</div>
    <div class="nutrient">Sugars: ${scale(product.nutriments.sugars)} g</div>
    <div class="nutrient">Fiber: ${product.nutriments.fiber === "?" ? "?" : scale(product.nutriments.fiber)} g</div>
    <div class="nutrient">Proteins: ${scale(product.nutriments.proteins)} g</div>
    <div class="nutrient">Salt: ${scale(product.nutriments.salt)} g</div>
    <div class="nutrient">Sodium: ${scale(product.nutriments.sodium)} g</div>
    <div class="nutrient">Quantity: <span class="quantity-value">${desiredQuantity}</span> g/ml</div>  `;
});








const code = new URLSearchParams(window.location.search).get("code");
handleFetch(code);

