import { Service } from '@angular/core';

@Service()
export class ProductPricingService {
    calculateDiscountedPrice( price: number, discountPercentage: number): number {
        if (price < 0) {
            throw new Error('Price cannot be negative');
        }
        if (discountPercentage < 0 || discountPercentage > 100) {
            throw new Error('Invalid discount percentage');
        }

        return price - (price * discountPercentage / 100);

    }

}
