import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperatorsDemo } from './operators-demo';

describe('OperatorsDemo', () => {
  let component: OperatorsDemo;
  let fixture: ComponentFixture<OperatorsDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorsDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorsDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
