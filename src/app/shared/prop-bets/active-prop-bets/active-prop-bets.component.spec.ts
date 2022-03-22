import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePropBetsComponent } from './active-prop-bets.component';

describe('ActivePropBetsComponent', () => {
  let component: ActivePropBetsComponent;
  let fixture: ComponentFixture<ActivePropBetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivePropBetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivePropBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
