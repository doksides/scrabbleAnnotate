/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MoveNavComponent } from './move-nav.component';

describe('MoveNavComponent', () => {
  let component: MoveNavComponent;
  let fixture: ComponentFixture<MoveNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
