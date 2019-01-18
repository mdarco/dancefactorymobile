import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDocsPage } from './member-docs.page';

describe('MemberDocsPage', () => {
  let component: MemberDocsPage;
  let fixture: ComponentFixture<MemberDocsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberDocsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDocsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
