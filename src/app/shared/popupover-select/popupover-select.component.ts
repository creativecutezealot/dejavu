import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { PopupoverSelectService } from './popupover-select.service';

@Component({
  selector: 'app-popupover-select',
  templateUrl: './popupover-select.component.html',
  styleUrls: ['./popupover-select.component.css']
})
export class PopupoverSelectComponent implements OnInit {

  _status = false;
  _class = [];
  _data = [];
  _ic_class = [];
  _is_ready = true;
  _event_name = "";

  popupOverSelectServiceSubscription = new Subscription();

  constructor(private popupOverSelectService: PopupoverSelectService) {
    this.popupOverSelectServiceSubscription = this.popupOverSelectService.dataSubject.subscribe(result => {
      if (this._is_ready == true) {
        if (result.status == true) {
          this._status = true;
          this._ic_class = [];
          this._class = [];
          this._data = result.data;
          this._is_ready = false;
          this._event_name = result.event;

          setTimeout(() => {
            this._class.push("active");
            setTimeout(() => {
              this._ic_class.push("active");
              this._is_ready = true;
              console.log(this._data)
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

  ngOnDestroy() {
    this.popupOverSelectServiceSubscription.unsubscribe();
  }

  onSelect(index) {
    if (!this._data[index].is_separator) {
      this.popupOverSelectService.dataSubject.next({ status: false, event: this._event_name, selected_index: index, selected_item: this._data[index] });
    }
  }

  closePopup() {
    this.popupOverSelectService.dataSubject.next({ status: false })
  }

}
