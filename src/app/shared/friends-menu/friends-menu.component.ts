import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { NotificationsService } from '../notifications/notifications.service';
@Component({
  selector: 'app-friends-menu',
  templateUrl: './friends-menu.component.html',
  styleUrls: ['./friends-menu.component.css']
})
export class FriendsMenuComponent implements OnInit {
  @Output('onSelectMenu') select_menu = new EventEmitter<string>();
  @Output('closed') closed = new EventEmitter<boolean>();
  @Input('animateClass') animateClass: string = "slideInRight";
  
  hasUnread = false;
  constructor(
    private notificationService:NotificationsService
  ) { 
    
  }

  ngOnInit() {

  }

  onClose() {
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }

  onMenuClick(page:string){
    this.animateClass = "slideOutLeft";
      this.select_menu.next(page);
  }

}
