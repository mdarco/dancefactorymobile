import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingsMemberPresencePage } from './trainings-member-presence.page';

describe('TrainingsMemberPresencePage', () => {
  let component: TrainingsMemberPresencePage;
  let fixture: ComponentFixture<TrainingsMemberPresencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingsMemberPresencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingsMemberPresencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
