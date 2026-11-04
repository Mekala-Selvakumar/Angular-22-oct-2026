import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecondViewChild2 } from './second-view-child2';

describe('SecondViewChild2', () => {
  let component: SecondViewChild2;
  let fixture: ComponentFixture<SecondViewChild2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondViewChild2],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondViewChild2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
