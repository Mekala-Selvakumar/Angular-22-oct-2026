import { TestBed } from '@angular/core/testing';
import { Product, ProductService } from './product-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ProductService (Jasmine + Karma)', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add a product via POST', () => {
    const newProduct: Product = { name: 'Gaming Chair', price: 15000 };
    const savedProduct: Product = { id: '3', ...newProduct };

    service.addProduct(newProduct).subscribe(res => {
      expect(res).toEqual(savedProduct);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(savedProduct);
  });

  it('should delete a product via DELETE', () => {
    service.deleteProduct('1').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
