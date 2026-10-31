export default class Product {
    id;
    name;
    price;
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    displayDetails() {
        console.log(`${this.id} - ${this.name} - ${this.price}`);
    }
    calculateDiscount(discountPercentage) {
        return this.price - (this.price * discountPercentage / 100);
    }
}
