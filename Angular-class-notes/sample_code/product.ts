export default class Product {
    constructor(public id: number, public name: string, public price: number) {

    }
    displayDetails(): void {
        console.log(`${this.id} - ${this.name} - ${this.price}`);
    }
    calculateDiscount(discountPercentage: number): number {
        return this.price - (this.price * discountPercentage / 100);
    }
}
