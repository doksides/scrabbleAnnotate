/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UiPlaytabComponent } from './ui-playtab.component';

describe('UiPlaytabComponent', () => {
  let component: UiPlaytabComponent;
  let fixture: ComponentFixture<UiPlaytabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiPlaytabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiPlaytabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
