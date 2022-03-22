import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PopupoverSelect } from 'src/app/models/popupover-select.model';

@Injectable({
  providedIn: 'root'
})
export class PopupoverSelectService {
  dataSubject = new Subject<{ status: boolean, event?: string, selected_index?: number, selected_item?: PopupoverSelect, data?: PopupoverSelect[] }>();
  constructor() {

  }
}
