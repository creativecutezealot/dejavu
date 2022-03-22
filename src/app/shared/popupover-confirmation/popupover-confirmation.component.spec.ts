import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupoverConfirmationComponent } from './popupover-confirmation.component';

describe('PopupoverConfirmationComponent', () => {
  let component: PopupoverConfirmationComponent;
  let fixture: ComponentFixture<PopupoverConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopupoverConfirmationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupoverConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
