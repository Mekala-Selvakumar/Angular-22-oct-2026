import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpProductList } from './http-product-list';

describe('HttpProductList', () => {
  let component: HttpProductList;
  let fixture: ComponentFixture<HttpProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpProductList],
    }).compileComponents();

    fixture = TestBed.createComponent(HttpProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
