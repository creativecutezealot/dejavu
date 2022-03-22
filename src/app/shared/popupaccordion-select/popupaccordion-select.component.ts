import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { PopupaccordionSelectService } from './popupaccordion-select.service';

@Component({
  selector: 'app-popupaccordion-select',
  templateUrl: './popupaccordion-select.component.html',
  styleUrls: ['./popupaccordion-select.component.css']
})
export class PopupaccordionSelectComponent implements OnInit {

  _status = false;
  _class = [];
  _data = [];
  _ic_class = [];
  _is_ready = true;
  _event_name = "";

  _temp = [];

  popupAccordionSelectServiceSubscription = new Subscription();

  constructor(private popupAccordionSelectService: PopupaccordionSelectService) {
    this.popupAccordionSelectServiceSubscription = this.popupAccordionSelectService.dataSubject.subscribe(result => {
      if (this._is_ready == true) {
        if (result.status == true) {
          this._status = true;
          this._ic_class = [];
          this._class = [];
          this._data = result.data.filter(item => item.is_separator);
          this._temp = result.data;
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
    this.popupAccordionSelectServiceSubscription.unsubscribe();
  }

  onSelect(index) {
    if (!this._data[index].is_separator) {
      this.popupAccordionSelectService.dataSubject.next({ status: false, event: this._event_name, selected_index: index, selected_item: this._data[index] });
    } else {
      console.log(':::', index, this._data[index]);
      let filtered0 = this._data.filter(item => !item.is_separator && item.key === this._data[index].key);
      if (filtered0.length > 0) {
        this._data.splice(index + 1, filtered0.length);
      } else {
        console.log("temp: ", this._temp);
        let filtered = this._temp.filter(item => !item.is_separator && item.key === this._data[index].key);
        console.log("filterd: ", filtered);
        filtered.map((item, i) => {
          var index1 = index + i + 1;
          this._data.splice(index1, 0, item);
        });
      }

      console.log(this._data);
    }
  }

  closePopup() {
    this.popupAccordionSelectService.dataSubject.next({ status: false })
  }

}
