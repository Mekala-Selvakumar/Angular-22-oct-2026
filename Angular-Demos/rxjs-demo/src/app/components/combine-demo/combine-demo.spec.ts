import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CombineDemo } from './combine-demo';

describe('CombineDemo', () => {
  let component: CombineDemo;
  let fixture: ComponentFixture<CombineDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombineDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(CombineDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
