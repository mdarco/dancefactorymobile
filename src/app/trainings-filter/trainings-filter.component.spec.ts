import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingsFilterComponent } from './trainings-filter.component';

describe('TrainingsFilterComponent', () => {
  let component: TrainingsFilterComponent;
  let fixture: ComponentFixture<TrainingsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
