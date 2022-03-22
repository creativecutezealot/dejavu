import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy, AfterContentInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameboardService } from 'src/app/gameboard/gameboard.service';

@Component({
  selector: 'app-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.css']
})
export class ScrollbarComponent implements OnInit,OnDestroy,AfterContentInit {

  @Input('scrollview') scrollview;
  @Input('scrollcontainer') scrollcontainer;
  @Input('height') height;
  @Input('top') top;
  @ViewChild('track',{'static':true}) track:ElementRef;
  @ViewChild('scroller',{'static':true}) scroller:ElementRef;
  @ViewChild('scrollbar',{'static':true}) scrollbar:ElementRef;
  sv;
  sc;
  curr_scroll = 0;
  scroll_amount = 1;
  dragging = false;
  scrollTop = 0;
  maxScroll = 0;
  scrollpercent = 0;
  totalscrollable = 0;
  constructor() { }

  ngOnInit() {
   
    this.sv = document.getElementById(this.scrollview);
    this.sc = document.getElementById(this.scrollcontainer);
    this.totalscrollable = this.sc.offsetHeight - this.sv.offsetHeight;
    this.maxScroll = (this.track.nativeElement.offsetHeight - this.scroller.nativeElement.offsetHeight);
    document.getElementById(this.scrollview).onscroll = ()=>{
      this.maxScroll = (this.track.nativeElement.offsetHeight - this.scroller.nativeElement.offsetHeight);
      this.totalscrollable = this.sc.offsetHeight - this.sv.offsetHeight; 
      this.scrollpercent = this.sv.scrollTop /  this.totalscrollable;
      this.scrollTop = this.maxScroll * this.scrollpercent;
    }
  }
  ngAfterContentInit(){

  }
  
  ngOnDestroy(){

  }

  onScrollUp(event){
    this.curr_scroll-=this.scroll_amount;
    this.setScroll(this.curr_scroll);    
  }
  onScrollDown(event){
    this.curr_scroll+=this.scroll_amount;
    this.setScroll(this.curr_scroll);
    this.scrollpercent = this.sv.scrollTop /  this.totalscrollable;
    this.scrollTop = this.maxScroll * this.scrollpercent;
  }

  setScroll(val){
    this.curr_scroll = this.sv.scrollTop = val;
  }
  onDragStart(event){
   
    this.dragging = true;

  }
  onDragging(event){
    if(this.dragging ){
      
      if(this.scrollTop>=0 && this.scrollTop <= (this.track.nativeElement.offsetHeight - this.scroller.nativeElement.offsetHeight)){
      this.scrollTop = (event.touches[0].clientY-200);
    }
    else if(this.scrollTop >= (this.track.nativeElement.offsetHeight - this.scroller.nativeElement.offsetHeight)){
      this.scrollTop = this.track.nativeElement.offsetHeight - this.scroller.nativeElement.offsetHeight;
      this.dragging =false;
    }
    else{
      this.dragging =false;
      this.scrollTop = 0;
    }
     this.maxScroll = (this.track.nativeElement.offsetHeight - this.scroller.nativeElement.offsetHeight);
     this.totalscrollable = this.sc.offsetHeight - this.sv.offsetHeight;
     this.scrollpercent = this.scrollTop / this.maxScroll; 
     this.setScroll((this.totalscrollable * this.scrollpercent));
     
     
    }
  }

  onDragEnd(event){
    
    this.dragging = false;

  }

}
