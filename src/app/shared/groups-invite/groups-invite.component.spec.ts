import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsInviteComponent } from './groups-invite.component';

describe('GroupsInviteComponent', () => {
  let component: GroupsInviteComponent;
  let fixture: ComponentFixture<GroupsInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
