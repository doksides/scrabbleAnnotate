import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMovelistComponent } from './ui-movelist.component';

describe('UiMovelistComponent', () => {
  let component: UiMovelistComponent;
  let fixture: ComponentFixture<UiMovelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiMovelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiMovelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
