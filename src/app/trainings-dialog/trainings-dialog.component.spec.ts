import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingsDialogComponent } from './trainings-dialog.component';

describe('TrainingsDialogComponent', () => {
  let component: TrainingsDialogComponent;
  let fixture: ComponentFixture<TrainingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
