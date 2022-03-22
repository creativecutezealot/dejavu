import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css']
})
export class SwitchComponent implements OnInit {
  @Input('status') status: boolean = false;
  @Output('onChange') onChange = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {

  }

  change() {
    this.status = !this.status;
    console.log(this.status);
    this.onChange.next(this.status);
  }

}
