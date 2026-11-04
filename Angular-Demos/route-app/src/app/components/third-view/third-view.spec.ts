import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThirdView } from './third-view';

describe('ThirdView', () => {
  let component: ThirdView;
  let fixture: ComponentFixture<ThirdView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdView],
    }).compileComponents();

    fixture = TestBed.createComponent(ThirdView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
