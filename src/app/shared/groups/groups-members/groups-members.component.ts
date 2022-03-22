import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Alertbox } from 'src/app/models/alertbox.model';
import { AlertboxService } from '../../alertbox/alertbox.service';
import { PopupoverConfirmationService } from '../../popupover-confirmation/popupover-confirmation.service';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'app-groups-members',
  templateUrl: './groups-members.component.html',
  styleUrls: ['./groups-members.component.css']
})
export class GroupsMembersComponent implements OnInit {
  @Output('create') create = new Subject<null>();
  @Output('invite') invite = new Subject<{group_id:string}>();
  @Input('events') _events: Subject<{ status: boolean,group_id?:string }>;
  @Input('status') _status = false;
  @Output('closed') closed = new EventEmitter<null>();

  _txt_member_search: string = "";
  _groups_members = [];
  _alertbox = new Alertbox();
  _group_id:string = "";
  _current_user_id:string = "";
  constructor(private groupsService:GroupsService,private popupoverConfirmationService:PopupoverConfirmationService,private alertboxService:AlertboxService) {
    this.popupoverConfirmationService.dataSubject.subscribe(result=>{
      if(result.event=="leave_group" && result.response == true){
          this.groupsService.leave(result.data.id).subscribe(result=>{

           this.closed.next(null);
          },
          error=>{
            this._alertbox.status = true;
            this._alertbox.message = error.error.message;
            this.alertboxService.alertbox.next(this._alertbox);
          }
          );
      }

      if(result.event=="remove_member" && result.response == true){
        this.groupsService.remove(result.data.id).subscribe(result=>{
          this.onShowMembers();
        },
        error=>{
          this._alertbox.status = true;
          this._alertbox.message = error.error.message;
          this.alertboxService.alertbox.next(this._alertbox);
        })
      }
    });

  }

  ngOnInit() {
    
    this._events.subscribe(result => {
     
      if (result.status == true) {
        this._status = true;
        this._group_id = result.group_id;
        this.onShowMembers();
      } else {
        this._status = false;
      }
    });
  }


  onShowMembers(){
    this._current_user_id = localStorage.getItem("auth_user_id");
    this.groupsService.list_members(this._group_id,this._txt_member_search).subscribe(result=>{
      
      this._groups_members = result.data.map((item,index,array)=>{
        
        if(item.groups.user_id == this._current_user_id){
          item.users.is_owner = true; 
        }
        return item;
      });

      
    });
  }

  onLeave() {
    this.popupoverConfirmationService.dataSubject.next({status:true,message:"Do you want to leave the group?",event:"leave_group",data:{id:this._group_id}});
  }

  onRemove(id:string){
    this.popupoverConfirmationService.dataSubject.next({status:true,message:"Do you want to remove the user?",event:"remove_member",data:{id:id}});
  }

  onInvite(){
    this.invite.next({group_id:this._group_id})
  }

}
