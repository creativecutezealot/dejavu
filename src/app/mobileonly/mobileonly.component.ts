import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobileonly',
  templateUrl: './mobileonly.component.html',
  styleUrls: ['./mobileonly.component.css']
})
export class MobileonlyComponent implements OnInit {

  constructor(private router:Router) { 

    if((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
      this.router.navigate(["/lobby"])
    }

  }

  ngOnInit() {
  }

}
