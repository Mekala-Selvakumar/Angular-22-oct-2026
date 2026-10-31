import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildProductCard } from './child-product-card';

describe('ChildProductCard', () => {
  let component: ChildProductCard;
  let fixture: ComponentFixture<ChildProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ChildProductCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
