import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-termspage',
  templateUrl: './termspage.component.html',
  styleUrls: ['./termspage.component.css']
})
export class TermspageComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<boolean>();
  @Input('page') page:string = '';
  animateClass:string = "slideInRight";
  title:string = "";
  constructor() { }

  ngOnInit() {  
  
    if(this.page=='t-and-c'){
      this.title = "Terms and Conditions";
    }else if(this.page=='p-p'){
      this.title = "Privacy Policy";
    }else if(this.page=='eula'){
      this.title = "End User Licensing Agreement (EULA)";
    }else if(this.page=='opensource'){
      this.title = "Open Source License";
    }
  }

  onClose(){
    this.animateClass = "slideOutRight";
    setTimeout(()=>{
      this.closed.next(true);
    },500);
  }
}
