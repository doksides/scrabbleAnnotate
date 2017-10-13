/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {FlashViewComponent} from './flash-view.component';

describe('FlashViewComponent', () => {
  let component : FlashViewComponent;
  let fixture : ComponentFixture < FlashViewComponent >;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({declarations: [FlashViewComponent]})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
