import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupoverTextfieldComponent } from './popupover-textfield.component';

describe('PopupoverTextfieldComponent', () => {
  let component: PopupoverTextfieldComponent;
  let fixture: ComponentFixture<PopupoverTextfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupoverTextfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupoverTextfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
