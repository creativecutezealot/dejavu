import { Component, OnInit } from '@angular/core';
import { PopupoverConfirmationService } from './popupover-confirmation.service';

@Component({
  selector: 'app-popupover-confirmation',
  templateUrl: './popupover-confirmation.component.html',
  styleUrls: ['./popupover-confirmation.component.css']
})
export class PopupoverConfirmationComponent implements OnInit {

  _title = "Confirm";
  _ok = "Yes";
  _cancel = "No";
  _status = false;
  _class = [];

  _ic_class = [];
  _is_ready = true;
  _event_name = "";
  _message = "";
  _data: any;

  constructor(private service: PopupoverConfirmationService) {
    this.service.dataSubject.subscribe(result => {
      if (this._is_ready == true) {
        if (result.status == true) {
          this._status = true;
          this._ic_class = [];
          this._class = [];
          this._title = result.title ? result.title : "Confirm";
          this._ok = result.ok ? result.ok : "Yes";
          this._cancel = result.cancel ? result.cancel : "No";
          this._message = result.message;
          this._is_ready = false;
          this._event_name = result.event;
          this._data = result.data;
          setTimeout(() => {
            this._class.push("active");
            setTimeout(() => {
              this._ic_class.push("active");
              this._is_ready = true;

            }, 500)
          }, 100);

        } else {
          this._ic_class.splice(this._ic_class.indexOf("active"), 1);
          this._is_ready = false;
          setTimeout(() => {
            this._class.splice(this._class.indexOf("active"), 1);
            this._status = false;
            this._is_ready = true;
          }, 500);
        }
      }
    });
  }

  ngOnInit() {

  }

  onResponse(response?: boolean) {
    this.service.dataSubject.next({ status: false, response: response, event: this._event_name, data: this._data })
  }
  closePopup() {
    this.service.dataSubject.next({ status: false })
  }
}
