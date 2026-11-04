import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MappingDemo } from './mapping-demo';

describe('MappingDemo', () => {
  let component: MappingDemo;
  let fixture: ComponentFixture<MappingDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MappingDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(MappingDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
