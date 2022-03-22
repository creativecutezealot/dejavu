import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupoverSelectComponent } from './popupover-select.component';

describe('PopupoverSelectComponent', () => {
  let component: PopupoverSelectComponent;
  let fixture: ComponentFixture<PopupoverSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupoverSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupoverSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
