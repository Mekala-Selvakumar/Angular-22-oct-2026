import { TestBed } from '@angular/core/testing';
import { ProductPricingService } from './product-pricing-service';

describe('ProductPricingService', () => {
  let service: ProductPricingService;

  //  beforeEach(() => {
  //   TestBed.configureTestingModule({
  //     providers: [
  //       ProductPricingService
  //     ]
  //   });

  //   service = TestBed.inject(ProductPricingService);

  // });
    beforeEach(() => {
    // Basic service initialization without the heavy TestBed overhead
    service = new ProductPricingService(); 
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate discounted product price', () => {
    const result = service.calculateDiscountedPrice(1000, 10);
    expect(result).toBe(900);

  });

  it('should return original price when discount is zero', () => {
    const result = service.calculateDiscountedPrice(1000, 0);
    expect(result).toBe(1000);
  });

  it('should return zero when discount is 100 percent', () => {
    const result =
      service.calculateDiscountedPrice(1000, 100);
    expect(result).toBe(0);

  });

  it('should throw an error for negative price', () => {
    expect(() =>
      service.calculateDiscountedPrice(-100, 10)
    ).toThrow('Price cannot be negative');

  });


//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(ProductPricing);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
});
