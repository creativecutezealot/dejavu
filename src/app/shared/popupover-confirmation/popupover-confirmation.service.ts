import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupoverConfirmationService {


  dataSubject = new Subject<{ status: boolean, message?: string, event?: string, response?: boolean, data?: any, title?: string, ok?: string, cancel?: string }>();
  constructor() {


  }
}
