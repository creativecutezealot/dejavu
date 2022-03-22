import { Component, OnInit } from '@angular/core';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  _status = false;
  _class = [];
  _is_ready = true;
  _message = "";
  constructor(private notificationService: NotificationsService) {
    this.notificationService.dataSubject.subscribe(result => {
      if (this._is_ready == true) {
        this._is_ready = false;

        if (result.status == true) {
          this._status = result.status;
          this._message = result.message;
          setTimeout(()=>{
            this._class.push("active");
            setTimeout(() => {
              this._class.splice(this._class.indexOf("active"), 1);
              setTimeout(() => {
                this._status = false;
                this._is_ready = true;
              }, 500);
            }, 5000);
          },100);
        }

      }
    });
  }

  ngOnInit() {

  }

}
