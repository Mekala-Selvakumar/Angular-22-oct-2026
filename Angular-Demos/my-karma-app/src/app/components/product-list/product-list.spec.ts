import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { ProductService } from '../../services/product-service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('ProductListComponent (Actions Testing)', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const initialProducts = [{ id: '10', name: 'Initial Mouse', price: 99 }];

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts', 'addProduct', 'deleteProduct']) as jasmine.SpyObj<ProductService>;

    mockProductService.getProducts.and.returnValue(of(initialProducts));
    mockProductService.addProduct.and.returnValue(of({ id: '11', name: 'New Pen', price: 15 }));
    mockProductService.deleteProduct.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [ProductList, FormsModule],
      providers: [{ provide: ProductService, useValue: mockProductService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call addProduct service action when form is submitted', () => {
    component.newName = 'New Pen';
    component.newPrice = 15;

    component.onAddProduct();

    expect(mockProductService.addProduct).toHaveBeenCalledWith({ name: 'New Pen', price: 15 });
    expect(mockProductService.getProducts).toHaveBeenCalled();
  });

  it('should call deleteProduct service action when delete button is pressed', () => {
    component.onDeleteProduct('10');

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith('10');
    expect(mockProductService.getProducts).toHaveBeenCalled();
  });
});
