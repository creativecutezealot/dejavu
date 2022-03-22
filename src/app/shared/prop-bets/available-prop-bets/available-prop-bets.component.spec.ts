import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailablePropBetsComponent } from './available-prop-bets.component';

describe('AvailablePropBetsComponent', () => {
  let component: AvailablePropBetsComponent;
  let fixture: ComponentFixture<AvailablePropBetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailablePropBetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailablePropBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
