import { Component, OnInit, Output,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.css']
})
export class HowToPlayComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<boolean>();
  boxClass:string = "bounceInDown";

  loaded = false;
  constructor() { }

  ngOnInit() {

    setTimeout(()=>{
      this.loaded = true;
    },1000)
  }

  onClose(){
    this.boxClass = 'bounceOutUp';
    this.closed.next(true);
    
  }


}
