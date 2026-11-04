import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsShell } from './products-shell';

describe('ProductsShell', () => {
  let component: ProductsShell;
  let fixture: ComponentFixture<ProductsShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsShell],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
