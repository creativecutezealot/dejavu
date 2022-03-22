import { Component, Inject, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AppService } from './app.service';
import { App } from './models/app.model';
import { DOCUMENT } from '@angular/common';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Baseball Craps';

  public app: App = new App();
  version = '1.0.5';

  constructor(private router: Router, private appService: AppService, @Inject(DOCUMENT) private document: Document, private fcmService: FcmService) {

    this.router.events.subscribe(event => {
      // if (event instanceof NavigationEnd) {
      //   if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && this.router.url != "/mobileonly") {
      //     this.router.navigate(["/mobileonly"])

      //   }
      // }
    });

    this.appService.appStatus.subscribe((app) => {
      this.app = app;
    })

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.app.app_loading = true;
        this.appService.appStatus.next(this.app);
      }
      if (event instanceof NavigationEnd) {
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
      }
    });

  }
  
  ngOnInit() {
    console.log('platform: ', window.navigator.platform);
    if (window.innerHeight >= 812 && window.innerHeight <= 926) {
      this.document.body.classList.add('iphoneLarge');
    }

    if (window.navigator.platform.toLowerCase() == "iphone") {
      this.document.body.classList.add("nativeMobile");
    } else {
      this.document.body.classList.add("browserMobile");
    }

    this.fcmService.initPush();
  }

}
