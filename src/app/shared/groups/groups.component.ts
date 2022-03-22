import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<boolean>();
  animateClass: string = "slideInRight";

  page_title: string = "My Groups";
  _page_title: string = "../../../assets/images/txt-my-groups.svg";
  _current_page: string = "my-groups";

  _groups_create_events = new Subject<{ status: boolean }>();
  _groups_events = new Subject<{ status: boolean }>();
  _groups_members_events = new Subject<{ status: boolean, group_id?: string }>();
  _groups_members_invite_events = new Subject<{ status: boolean, group_id?: string }>();

  _group_id: string = "";
  ngOnInit() {

    setTimeout(() => {
      this._groups_events.next({ status: true });
      this._groups_create_events.next({ status: false });
      this._groups_members_events.next({ status: false });
      this._groups_members_invite_events.next({ status: false });
    }, 100);
    this._current_page = "my-groups";
  }



  onClose() {

    if (this._current_page == "my-groups") {
      this.animateClass = "slideOutRight";
      this.closed.next(true);
    }

    if (this._current_page == "add" || this._current_page == "members") {
      this._groups_members_events.next({ status: false });
      this._groups_create_events.next({ status: false });
      this._groups_events.next({ status: true });
      this._current_page = "my-groups";
      this._page_title = "../../../assets/images/txt-my-groups.svg";
    }

    if (this._current_page == "invite-members") {
      this._groups_members_invite_events.next({ status: false });
      this._groups_members_events.next({ status: true, group_id: this._group_id });
      this._current_page = "members";
      this._page_title = "../../../assets/images/txt-members.svg";
    }


  }


  onAddGroup() {
    this._groups_create_events.next({ status: true });
    this._groups_events.next({ status: false });
    this._groups_members_events.next({ status: false });
    this._current_page = "add";
    this.page_title = "Create new group";
  }

  onShowMembers(events) {
    this._group_id = events.group_id;
    this._groups_members_events.next({ status: true, group_id: events.group_id });
    this._groups_create_events.next({ status: false });
    this._groups_events.next({ status: false });
    this._current_page = "members";
    this._page_title = "../../../assets/images/txt-members.svg";
  }

  onInvite(events) {
    this._group_id = events.group_id;
    this._groups_members_events.next({ status: false });
    this._groups_members_invite_events.next({ status: true, group_id: events.group_id });
    this._current_page = "invite-members";
    this._page_title = "../../../assets/images/txt-invite.svg";
  }
}
