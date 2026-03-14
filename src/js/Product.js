export default class Product {
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
