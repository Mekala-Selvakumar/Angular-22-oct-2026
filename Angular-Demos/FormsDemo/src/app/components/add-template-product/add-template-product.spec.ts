import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTemplateProduct } from './add-template-product';

describe('AddTemplateProduct', () => {
  let component: AddTemplateProduct;
  let fixture: ComponentFixture<AddTemplateProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTemplateProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTemplateProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
