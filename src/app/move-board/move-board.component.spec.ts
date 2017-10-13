/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MoveBoard;Component } from './move-board;.component';

describe('MoveBoard;Component', () => {
  let component: MoveBoard;Component;
  let fixture: ComponentFixture<MoveBoard;Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveBoard;Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveBoard;Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
