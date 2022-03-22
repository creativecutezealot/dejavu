import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.css']
})
export class PreloaderComponent implements OnInit {

  isActive:boolean;
  constructor(private appService:AppService) { }

  ngOnInit() {
    this.appService.appStatus.subscribe((app)=>{
      this.isActive = app.app_loading;
    });
  }

}
