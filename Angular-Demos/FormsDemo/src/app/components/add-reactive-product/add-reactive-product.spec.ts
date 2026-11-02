import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddReactiveProduct } from './add-reactive-product';

describe('AddReactiveProduct', () => {
  let component: AddReactiveProduct;
  let fixture: ComponentFixture<AddReactiveProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReactiveProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(AddReactiveProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
