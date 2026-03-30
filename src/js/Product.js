export default class Product {
  #codeBarre;
  #imageUrl;
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
    this.#codeBarre = data.code ?? "";
    this.#imageUrl = data.product.image_url ?? "";
    this.#name = data.product.product_name_en ?? "";
    this.#energy = data.product.nutriments?.energy ?? "?";
    this.#fat = data.product.nutriments?.fat ?? "?";
    this.#saturatedFat = data.product.nutriments?.["saturated-fat"] ?? "?";
    this.#carbohydrates = data.product.nutriments?.carbohydrates ?? "?";
    this.#sugars = data.product.nutriments?.sugars ?? "?";
    this.#fiber = data.product.nutriments?.fiber ?? "?";
    this.#proteins = data.product.nutriments?.proteins ?? "?";
    this.#salt = data.product.nutriments?.salt ?? "?";
    this.#sodium = data.product.nutriments?.sodium ?? "?";
    this.#quantity = data.product.quantity ?? "";
  }
  get codeBarre() {
    return this.#codeBarre;
  }
  get imageUrl() {
    return this.#imageUrl;
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
