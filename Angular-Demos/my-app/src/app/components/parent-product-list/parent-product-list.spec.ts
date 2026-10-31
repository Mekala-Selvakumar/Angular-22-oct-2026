import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentProductList } from './parent-product-list';

describe('ParentProductList', () => {
  let component: ParentProductList;
  let fixture: ComponentFixture<ParentProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentProductList],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
