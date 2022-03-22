import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alertbox } from 'src/app/models/alertbox.model';
import { AlertboxService } from '../alertbox/alertbox.service';
import { GroupsService } from '../groups/groups.service';
import { PopupoverConfirmationService } from '../popupover-confirmation/popupover-confirmation.service';

@Component({
  selector: 'app-groups-invite',
  templateUrl: './groups-invite.component.html',
  styleUrls: ['./groups-invite.component.css']
})
export class GroupsInviteComponent implements OnInit {

  @Output('closed') closed = new EventEmitter<boolean>();
  animateClass: string = "slideInRight";

  _txt_search:string = "";
  _current_page: string = "groups-pending-invites";

  popupConfirmationSubscription  = new Subscription();

  _groups_members = [];
  _alertbox = new Alertbox();
  constructor(private groupsService:GroupsService ,private popupoverConfirmationService:PopupoverConfirmationService,private alertboxService:AlertboxService) { 
    this.popupConfirmationSubscription = this.popupoverConfirmationService.dataSubject.subscribe(result=>{
      if(result.event=="join_group" && result.response == true){
        this.groupsService.accept(result.data.id).subscribe(result=>{
          this.onShowSearch();
        },error=>{
          this._alertbox.status = true;
          this._alertbox.hasButton = true;
          this._alertbox.message = error.error.message;
          this.alertboxService.alertbox.next(this._alertbox);
        });
      }
    });

  }

  ngOnInit() {
    this.onShowSearch();
  }


  onShowSearch(events?){
        this.groupsService.pending(this._txt_search).subscribe(result=>{
          this._groups_members = result.data;
        },error=>{
          this._alertbox.status = true;
          this._alertbox.hasButton = true;
          this._alertbox.message = error.error.message;
          this.alertboxService.alertbox.next(this._alertbox);
        });
  }

  onJoin(id:string){
    this.popupoverConfirmationService.dataSubject.next({status:true,message:"Do you want to join to the group?",event:"join_group",data:{id:id}});
  }



  onClose() {
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }

}
