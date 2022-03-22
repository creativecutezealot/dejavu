import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<boolean>();
  animateClass:string = "slideInRight";

  termspage = "";
  constructor(private appService:AppService) { 

  }

  ngOnInit() {

  }
  onClose(){
    this.animateClass = "slideOutRight";
    this.closed.next(true);
   
  }

  onCloseDefault(){
    this.termspage = "";
  }

  loadterms(page){
    this.termspage =page;
  }
}
