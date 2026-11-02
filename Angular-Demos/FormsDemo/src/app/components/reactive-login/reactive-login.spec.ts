import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveLogin } from './reactive-login';

describe('ReactiveLogin', () => {
  let component: ReactiveLogin;
  let fixture: ComponentFixture<ReactiveLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
