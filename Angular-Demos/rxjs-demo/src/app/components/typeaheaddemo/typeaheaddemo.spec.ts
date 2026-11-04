import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Typeaheaddemo } from './typeaheaddemo';

describe('Typeaheaddemo', () => {
  let component: Typeaheaddemo;
  let fixture: ComponentFixture<Typeaheaddemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Typeaheaddemo],
    }).compileComponents();

    fixture = TestBed.createComponent(Typeaheaddemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
