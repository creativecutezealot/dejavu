import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public socket;
  public dataSubject = new Subject<{ status: boolean, message?: string }>();
  public notificationCountSubject = new Subject<{ total_notification: number, new_friend_request_total: number }>();



  constructor(private config: AppConfig) {

  }

  public init() {
    this.socket = socketIo(this.config.socketUrl);
    this.socket.removeAllListeners();


    this.socket.on("update_notification", data => {
      const user_id = localStorage.getItem("auth_user_id")
      if (data.to_id == user_id) {
        this.dataSubject.next({ status: true, message: data.message });
      }
    });


    // update notification count
    this.socket.on("update_notification_count", data => {
      this.notificationCountSubject.next(data);
    });

  }


}
