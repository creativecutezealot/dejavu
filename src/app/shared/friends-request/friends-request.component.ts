import { Component, OnInit,EventEmitter,Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FriendsService } from '../friends/friends.service';
import { PopupoverConfirmationService } from '../popupover-confirmation/popupover-confirmation.service';

@Component({
  selector: 'app-friends-request',
  templateUrl: './friends-request.component.html',
  styleUrls: ['./friends-request.component.css']
})
export class FriendsRequestComponent implements OnInit, OnDestroy {
  @Output('closed') closed = new EventEmitter<boolean>();
  animateClass: string = "slideInRight";

  page_title:string = "My Friends";
  current_page:string = "my-friends";
 
  txt_friends_search = "";
  user_friends = [];
  popupConfirmationSubscription = new Subscription()

  constructor(private friendsService:FriendsService, private popupoverConfirmationService:PopupoverConfirmationService) { 

    this.popupConfirmationSubscription = this.popupoverConfirmationService.dataSubject.subscribe(result=>{
      if(result.event=="acceptfriend_user" && result.response == true){
        this.friendsService.acceptFriend(result.data.id).subscribe(result=>{
          if(result.status==true){
            this.onShowFriends();
          }
        });
      }
    });
  }

  ngOnInit() {
    this.onShowFriends();
  }

  ngOnDestroy(){
    this.popupConfirmationSubscription.unsubscribe();
  }


  onClose() {
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }

  onShowFriends(){
    this.friendsService.listFriends(this.txt_friends_search,false).subscribe(result=>{
      this.user_friends = result.data;
    });
  }
  onAccept(id){
    this.popupoverConfirmationService.dataSubject.next({status:true,message:"Do you want to accept the friend request?",event:"acceptfriend_user",data:{id:id}});
  }//end

}
