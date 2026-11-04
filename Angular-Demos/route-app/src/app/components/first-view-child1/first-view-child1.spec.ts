import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirstViewChild1 } from './first-view-child1';

describe('FirstViewChild1', () => {
  let component: FirstViewChild1;
  let fixture: ComponentFixture<FirstViewChild1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstViewChild1],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstViewChild1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
