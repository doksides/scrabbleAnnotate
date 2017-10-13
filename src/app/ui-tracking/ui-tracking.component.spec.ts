import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTrackingComponent } from './ui-tracking.component';

describe('UiTrackingComponent', () => {
  let component: UiTrackingComponent;
  let fixture: ComponentFixture<UiTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
