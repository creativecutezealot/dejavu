import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupoverTextfieldService {


  dataSubject = new Subject<{status:boolean,event?:string,entered_value?:number}>();
  constructor() { 

  }
}
