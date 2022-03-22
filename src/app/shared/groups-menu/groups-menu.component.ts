import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-groups-menu',
  templateUrl: './groups-menu.component.html',
  styleUrls: ['./groups-menu.component.css']
})
export class GroupsMenuComponent implements OnInit {
  @Output('onSelectMenu') select_menu = new EventEmitter<string>();
  @Output('closed') closed = new EventEmitter<boolean>();
  @Input('animateClass') animateClass: string = "slideInRight";
  
  hasUnread = false;
  constructor() { }

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
