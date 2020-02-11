import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingsPage } from './trainings.page';

describe('TrainingsPage', () => {
  let component: TrainingsPage;
  let fixture: ComponentFixture<TrainingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
