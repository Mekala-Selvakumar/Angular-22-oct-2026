import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsyncDemo } from './async-demo';

describe('AsyncDemo', () => {
  let component: AsyncDemo;
  let fixture: ComponentFixture<AsyncDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(AsyncDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
