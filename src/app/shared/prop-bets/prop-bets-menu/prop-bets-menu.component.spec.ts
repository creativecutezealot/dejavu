import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropBetsMenuComponent } from './prop-bets-menu.component';

describe('PropBetsMenuComponent', () => {
  let component: PropBetsMenuComponent;
  let fixture: ComponentFixture<PropBetsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropBetsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropBetsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
