import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FriendsService } from './friends.service';
import { isTabSwitch } from '@ionic/angular/dist/directives/navigation/stack-utils';
import { User } from 'src/app/models/user.model';
import { UsersFriends } from 'src/app/models/users_friends.model';
import { PopupoverConfirmationService } from '../popupover-confirmation/popupover-confirmation.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<boolean>();
  animateClass: string = "slideInRight";

  //page_title:string = "My Friends";
  _page_title = "../../../assets/images/txt-my-friends.svg";
  current_page:string = "my-friends";
  txt_search_users = "";
  txt_friends_search = "";
  user_search_results = [];
  user_friends = [];

  constructor(private friendsService:FriendsService, private popupoverConfirmationService:PopupoverConfirmationService) { 
      this.popupoverConfirmationService.dataSubject.subscribe(result=>{
          if(result.event=="unfriend_user" && result.response == true){
            this.friendsService.unfriend(result.data.id).subscribe(result=>{
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

  onAddFriend(){
    this.current_page = "add-friend";
    //this.page_title = "Add Friend";
    this._page_title = "../../../assets/images/txt-add-friend.svg";
  }

  onCancelAddFriend(){
    this.current_page = "my-friends";
    this._page_title = "../../../assets/images/txt-my-friends.svg";

    this.onShowFriends();
  }


  onClose() {
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }
  
  onShowFriends(){
    this.friendsService.listFriends(this.txt_friends_search,true).subscribe(result=>{
      this.user_friends = result.data;
    });
  }

  onSearchUsers(event){
      this.friendsService.searchUsers(this.txt_search_users).subscribe(result=>{
       this.user_search_results = result.data;
      });
  }

  onUnfriend(id){
    this.popupoverConfirmationService.dataSubject.next({status:true,message:"Do you want to unfriend this user?",event:"unfriend_user",data:{id:id}});
    
  }

  onSendFriendRequest(id:string,item:User){
    this.friendsService.sendFriendRequest(id).subscribe(result=>{
      item.users_friends = new UsersFriends(item._id,id,false);
    });
  }

}
