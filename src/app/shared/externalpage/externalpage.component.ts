import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { HttpClient } from '@angular/common/http';
import { ExternalPageService } from './externalpage.service';

@Component({
  selector: 'app-externalpage',
  templateUrl: './externalpage.component.html',
  styleUrls: ['./externalpage.component.css']
})
export class ExternalpageComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<boolean>();
 @Input('url') url:string = '';
 @Input('title') title:string = '';
 animateClass:string = "slideInRight";
  constructor(private appService:AppService,private externalpageService:ExternalPageService) { }

  ngOnInit() {
 
  }
  onClose(){
    this.animateClass = "slideOutRight";
    setTimeout(()=>{
      this.closed.next(true);
    },500);
  }

}
