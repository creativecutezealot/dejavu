import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropBetOutcomesComponent } from './prop-bet-outcomes.component';

describe('PropBetOutcomesComponent', () => {
  let component: PropBetOutcomesComponent;
  let fixture: ComponentFixture<PropBetOutcomesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropBetOutcomesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropBetOutcomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
