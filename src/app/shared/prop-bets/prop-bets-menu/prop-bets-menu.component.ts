import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-prop-bets-menu',
  templateUrl: './prop-bets-menu.component.html',
  styleUrls: ['./prop-bets-menu.component.css']
})
export class PropBetsMenuComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<boolean>();
  @Output('onSelectMenu') select_menu = new EventEmitter<string>();
  @Input('animateClass') animateClass: string = "slideInRight";

  constructor() { }

  ngOnInit() {

  }

  onClose() {
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }

  onMenuClick(page: string) {
    this.animateClass = "slideOutLeft";
    this.select_menu.next(page);
  }

}
