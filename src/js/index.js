// import { Product } from "./Product.js";

const constants = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const BASE_URL = "https://world.openfoodfacts.org/api/v3/product/";
const FIELDS =
  "nutriments,image_url,product_name_en,nutriscore_grades,quantity";

async function callAPI(productCode) {
  const url = `${BASE_URL}${productCode}?fields=${FIELDS}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === constants.NOT_FOUND) {
      throw new Error("Product not found.");
    }

    if (response.status === constants.INTERNAL_SERVER_ERROR) {
      throw new Error("Server error. Please try again later.");
    }

    if (response.status !== constants.OK) {
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
    console.warn("callAPI error:", err);
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

function storeLocalStorage() {

}

async function neededData(productCode) {
  try {
    const data = await callAPI(productCode);

    if (data.status === "success" && data.product) {
      const product = new Product(data.product);
      displayProduct(product);
      storeLocalStorage(product);
    } else {
      console.warn("Product not found or API returned an error");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}











/////////////////////////////////////////////////////////////////////////



class Product {
  #name;
  #energy;
  #fat;
  #saturatedFat;
  #carbohydrates;
  #sugars;
  #fiber;
  #proteins;
  #salt;
  #sodium;
  #quantity;

  constructor(data) {
    this.#name = data.product_name_en || "";
    this.#energy = data.nutriments?.energy || "?";
    this.#fat = data.nutriments?.fat || "?";
    this.#saturatedFat = data.nutriments?.saturated_fat || "?";
    this.#carbohydrates = data.nutriments?.carbohydrates || "?";
    this.#sugars = data.nutriments?.sugars || "?";
    this.#fiber = data.nutriments?.fiber || "?";
    this.#proteins = data.nutriments?.proteins || "?";
    this.#salt = data.nutriments?.salt || "?";
    this.#sodium = data.nutriments?.sodium || "?";
    this.#quantity = data.quantity || "";
  }

  get name() {
    return this.#name;
  }
  get energy() {
    return this.#energy;
  }
  get fat() {
    return this.#fat;
  }
  get saturatedFat() {
    return this.#saturatedFat;
  }
  get carbohydrates() {
    return this.#carbohydrates;
  }
  get sugars() {
    return this.#sugars;
  }
  get fiber() {
    return this.#fiber;
  }
  get proteins() {
    return this.#proteins;
  }
  get salt() {
    return this.#salt;
  }
  get sodium() {
    return this.#sodium;
  }
  get quantity() {
    return this.#quantity;
  }
}
