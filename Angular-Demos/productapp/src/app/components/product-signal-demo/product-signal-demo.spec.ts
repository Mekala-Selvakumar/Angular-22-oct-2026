import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSignalDemo } from './product-signal-demo';

describe('ProductSignalDemo', () => {
  let component: ProductSignalDemo;
  let fixture: ComponentFixture<ProductSignalDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSignalDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSignalDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
