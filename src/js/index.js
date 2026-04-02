import Product from "./Product.js";
import { NOT_FOUND, INTERNAL_SERVER_ERROR, OK } from "./utils.js";

const notyf = new Notyf({
  duration: 3000,
  position: { x: "right", y: "top" },
  dismissible: true,
});

const BASE_URL = "https://world.openfoodfacts.org/api/v3/product/";
const FIELDS = "nutriments,image_url,product_name_en,quantity";

// Sécurisation contre l'injection (XSS)
function escapeHTML(str) {
  if (typeof str !== "string") return str;
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[tag],
  );
}

async function fetchData(productCode) {
  const url = `${BASE_URL}${productCode}?fields=${FIELDS}`;
  try {
    const response = await fetch(url);
    if (response.status === NOT_FOUND) throw new Error("Product not found.");
    if (response.status === INTERNAL_SERVER_ERROR)
      throw new Error("Server error.");
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (err) {
    return { status: "error", message: err.message };
  }
}

// FONCTION DRY : Un seul endroit pour gérer l'affichage
function renderProduct(product, desiredQuantity) {
  const baseQuantity = parseFloat(product.quantity) || 100;
  const factor = (desiredQuantity ?? baseQuantity) / baseQuantity;

  const scale = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "?" : (num * factor).toFixed(2);
  };

  const container = document.getElementById("product");
  container.innerHTML = `
        <h2 class="text-xl font-bold mb-4">${escapeHTML(product.name)}</h2>
        <img src="${escapeHTML(product.imageUrl)}" class="w-64 rounded-lg bg-white mb-4">
        <div class="w-full text-sm flex flex-col gap-2">
            ${[
              "energy",
              "fat",
              "saturatedFat",
              "carbohydrates",
              "sugars",
              "proteins",
              "salt",
            ]
              .map(
                (key) => `
                <div class="flex justify-between border-b border-gray-700 pb-1">
                    <span class="capitalize">${key.replace("Fat", " Fat")}:</span>
                    <span>${scale(product[key])} ${key === "energy" ? "kcal" : "g"}</span>
                </div>
            `,
              )
              .join("")}
            <div class="flex justify-between font-bold text-white pt-2">
                <span>Quantity:</span> <span>${desiredQuantity ?? baseQuantity} g/ml</span>
            </div>
        </div>
    `;
}

function storeLocalStorage(product) {
  const productData = {
    code: product.codeBarre,
    product: {
      image_url: product.imageUrl,
      product_name_en: product.name,
      nutriments: {
        energy: product.energy,
        fat: product.fat,
        ["saturated-fat"]: product.saturatedFat,
        carbohydrates: product.carbohydrates,
        sugars: product.sugars,
        proteins: product.proteins,
        salt: product.salt,
        sodium: product.sodium,
      },
      quantity: product.quantity,
    },
  };
  localStorage.setItem(product.codeBarre, JSON.stringify(productData));
}

function getProductFromLocalStorage(productCode) {
  const data = localStorage.getItem(productCode);
  return data ? JSON.parse(data) : null;
}

const slider = document.querySelector("#slider");
const valueDisplay = document.getElementById("value-slider");
let currentProduct = null;

slider.addEventListener("input", () => {
  if (!currentProduct) return;
  const val = Number(slider.value);
  valueDisplay.textContent = val;
  renderProduct(currentProduct, val);
});

async function init() {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) return;

  const saved = getProductFromLocalStorage(code);
  if (saved) {
    currentProduct = new Product(saved);
  } else {
    const data = await fetchData(code);
    if (data.product) {
      currentProduct = new Product(data);
      storeLocalStorage(currentProduct);
    } else {
      notyf.error("Produit introuvable");
      return;
    }
  }

  const baseQty = parseFloat(currentProduct.quantity) || 100;
  slider.max = baseQty * 2;
  slider.value = baseQty;
  valueDisplay.textContent = baseQty;
  renderProduct(currentProduct, baseQty);
}

init();
