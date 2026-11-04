import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorDemo } from './error-demo';

describe('ErrorDemo', () => {
  let component: ErrorDemo;
  let fixture: ComponentFixture<ErrorDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
