import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OddsRulesComponent } from './odds-rules.component';

describe('OddsRulesComponent', () => {
  let component: OddsRulesComponent;
  let fixture: ComponentFixture<OddsRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OddsRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OddsRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
