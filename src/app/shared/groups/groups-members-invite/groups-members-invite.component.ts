import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Alertbox } from 'src/app/models/alertbox.model';
import { AlertboxService } from '../../alertbox/alertbox.service';
import { PopupoverConfirmationService } from '../../popupover-confirmation/popupover-confirmation.service';
import { GroupsService } from '../groups.service';
import { User } from '../../../models/user.model';
import { group } from '@angular/animations';

@Component({
  selector: 'app-groups-members-invite',
  templateUrl: './groups-members-invite.component.html',
  styleUrls: ['./groups-members-invite.component.css']
})
export class GroupsMembersInviteComponent implements OnInit {

  @Input('events') _events: Subject<{ status: boolean, group_id?: string }>;
  @Input('status') _status = false;
  @Output('closed') closed = new EventEmitter<null>();

  _txt_user_search: string = "";
  _users = [];
  _alertbox = new Alertbox();
  _group_id: string = "";
  _current_user_id: string = "";
  constructor(private groupsService: GroupsService, private popupoverConfirmationService: PopupoverConfirmationService, private alertboxService: AlertboxService) {


  }

  ngOnInit() {
    this._events.subscribe(result => {

      if (result.status == true) {
        this._status = true;
        this._group_id = result.group_id;
        this._txt_user_search = "";
         this.onShowMembers();
      } else {
        this._status = false;
      }
    });
  }


  onShowMembers() {
    if (this._txt_user_search.toString() != "") {
      this.groupsService.search_users(this._txt_user_search).subscribe(result => {
        this._users = result.data.map((user,index)=>{
          user.join_group_status = 0;
            if(user.groups_members.length>0){
            
               var groups_members  = user.groups_members;
               for(var i=0;i<groups_members.length;i++){
                 console.log(groups_members[i]);
                  if(groups_members[i].group_id==this._group_id){
                    user.join_group_status = 2;
                    if(groups_members[i].status==true){
                      user.join_group_status = 1;
                    }
                  }
               }
            }
            return user;
        });
      },
        error => {
          this._alertbox.status = true;
          this._alertbox.hasButton = true;
          this._alertbox.message = error.error.message;
          this.alertboxService.alertbox.next(this._alertbox);
        });
    } else {
      this._users = [];
    }
  }//end

  onInvite(user_id: string,user:User) {
    this.groupsService.invite_user(this._group_id,user_id).subscribe(result=>{
      user.join_group_status = 2;
      if(result.status==false){
        this._alertbox.status = true;
        this._alertbox.hasButton = true;
        this._alertbox.message = result.message;
        this.alertboxService.alertbox.next(this._alertbox);
      }
    },error=>{
      this._alertbox.status = true;
      this._alertbox.hasButton = true;
      this._alertbox.message = error.error.message;
      this.alertboxService.alertbox.next(this._alertbox);
    });
  }

}
