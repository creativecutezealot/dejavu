import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Alertbox } from 'src/app/models/alertbox.model';
import { Groups } from 'src/app/models/groups.model';
import { AlertboxService } from '../../alertbox/alertbox.service';
import { PopupoverConfirmationService } from '../../popupover-confirmation/popupover-confirmation.service';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.css']
})
export class GroupsListComponent implements OnInit {
  @Output('create') create = new Subject<null>();
  @Output('show_members') show_members = new Subject<{group_id:string}>();

  @Input('events') _events: Subject<{ status: boolean }>;
  @Input('status') _status = false;

  _txt_groups_search: string = "";
  _user_groups = [];
  _alertbox = new Alertbox();
  constructor(private groupsService:GroupsService,private popupoverConfirmationService:PopupoverConfirmationService,private alertboxService:AlertboxService) {
  
  }

  ngOnInit() {
    this._events.subscribe(result => {
     
      if (result.status == true) {
        this._status = true;
        this.onShowGroups();
      } else {
        this._status = false;
      }
    });

    
  }

  onShowGroups(event?) {
    this.groupsService.list(this._txt_groups_search).subscribe(result=>{
        this._user_groups = result.data;
    });
  }

  onAddGroup() {
    this.create.next(null);
  }
  onShowMembers(group_id:string){

    this.show_members.next({group_id:group_id});
  }



}
