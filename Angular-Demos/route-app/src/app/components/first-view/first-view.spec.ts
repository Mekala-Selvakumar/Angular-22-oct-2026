import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirstView } from './first-view';

describe('FirstView', () => {
  let component: FirstView;
  let fixture: ComponentFixture<FirstView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstView],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
