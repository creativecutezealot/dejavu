import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsMenuComponent } from './groups-menu.component';

describe('GroupsMenuComponent', () => {
  let component: GroupsMenuComponent;
  let fixture: ComponentFixture<GroupsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});