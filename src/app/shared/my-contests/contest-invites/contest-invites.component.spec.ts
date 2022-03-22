import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestInvitesComponent } from './contest-invites.component';

describe('ContestInvitesComponent', () => {
  let component: ContestInvitesComponent;
  let fixture: ComponentFixture<ContestInvitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestInvitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestInvitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
