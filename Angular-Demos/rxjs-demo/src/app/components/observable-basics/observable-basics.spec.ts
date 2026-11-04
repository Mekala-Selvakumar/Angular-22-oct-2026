import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservableBasics } from './observable-basics';

describe('ObservableBasics', () => {
  let component: ObservableBasics;
  let fixture: ComponentFixture<ObservableBasics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservableBasics],
    }).compileComponents();

    fixture = TestBed.createComponent(ObservableBasics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
