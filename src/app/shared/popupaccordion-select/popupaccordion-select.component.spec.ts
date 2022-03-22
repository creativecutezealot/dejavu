import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupaccordionSelectComponent } from './popupaccordion-select.component';

describe('PopupaccordionSelectComponent', () => {
  let component: PopupaccordionSelectComponent;
  let fixture: ComponentFixture<PopupaccordionSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupaccordionSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupaccordionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
