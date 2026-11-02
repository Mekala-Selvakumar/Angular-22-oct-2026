import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventorySummary } from './inventory-summary';

describe('InventorySummary', () => {
  let component: InventorySummary;
  let fixture: ComponentFixture<InventorySummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySummary],
    }).compileComponents();

    fixture = TestBed.createComponent(InventorySummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
