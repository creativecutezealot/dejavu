import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opensource',
  templateUrl: './opensource.component.html',
  styleUrls: ['./opensource.component.css']
})
export class OpensourceComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }
 
  goToSection(sec:string){
    
      document.getElementById("terms_page_content").scrollTo({top:(document.getElementById(sec).offsetTop - 130),left:0,behavior:'smooth'});
  }

}
