import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupoverConfirmationService } from '../../popupover-confirmation/popupover-confirmation.service';
import { ContestService } from '../contests.service';

@Component({
  selector: 'app-contest-invites',
  templateUrl: './contest-invites.component.html',
  styleUrls: ['./contest-invites.component.css']
})
export class ContestInvitesComponent implements OnInit {
  @Output('onSelectMenu') select_menu = new EventEmitter<string>();
  @Output('closed') closed = new EventEmitter<boolean>();
  @Input('animateClass') animateClass: string = "slideInRight";
  constructor(private contestService: ContestService, private popupoverConfirmationService:PopupoverConfirmationService) { 
    this.popupConfirmationSubscription = this.popupoverConfirmationService.dataSubject.subscribe(result=>{
      if(result.event=="accept_contest" && result.response == true){
        this.contestService.acceptInvite(result.data.id).subscribe(result=>{
          if(result.status==true){
            this.myContest();
          }
        });
      }
    });
  }
  contestInvites = []
  popupConfirmationSubscription = new Subscription()
  ngOnInit() {
    this.contestService.invites().subscribe( r => {
      this.contestInvites = r["data"] ? r["data"] : []
    })
  }

  onClose() {
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }

  onAccept(id){
    this.popupoverConfirmationService.dataSubject.next({status:true,message:"Do you want to join on this contest?",event:"accept_contest",data:{id:id}});
  }

  myContest() {
    this.animateClass = "slideOutLeft";
    this.select_menu.next('my-contests');
  }

}
