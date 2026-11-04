import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecondView } from './second-view';

describe('SecondView', () => {
  let component: SecondView;
  let fixture: ComponentFixture<SecondView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondView],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
