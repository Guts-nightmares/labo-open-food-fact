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

  constructor(data = {}) {
    this.#name = data.product_name_en || "";
    this.#energy = data.nutriments?.energy || 0;
    this.#fat = data.nutriments?.fat || 0;
    this.#saturatedFat = data.nutriments?.saturated_fat || 0;
    this.#carbohydrates = data.nutriments?.carbohydrates || 0;
    this.#sugars = data.nutriments?.sugars || 0;
    this.#fiber = data.nutriments?.fiber || 0;
    this.#proteins = data.nutriments?.proteins || 0;
    this.#salt = data.nutriments?.salt || 0;
    this.#sodium = data.nutriments?.sodium || 0;
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
