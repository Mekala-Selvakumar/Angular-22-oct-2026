import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecondViewChild1 } from './second-view-child1';

describe('SecondViewChild1', () => {
  let component: SecondViewChild1;
  let fixture: ComponentFixture<SecondViewChild1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondViewChild1],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondViewChild1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
