import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropBetConfirmationComponent } from './prop-bet-confirmation.component';

describe('PropBetConfirmationComponent', () => {
  let component: PropBetConfirmationComponent;
  let fixture: ComponentFixture<PropBetConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropBetConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropBetConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
