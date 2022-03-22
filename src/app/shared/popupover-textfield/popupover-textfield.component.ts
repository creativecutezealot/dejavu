import { Component, OnInit } from '@angular/core';
import { PopupoverTextfieldService } from './popupover-textfield.service';

@Component({
  selector: 'app-popupover-textfield',
  templateUrl: './popupover-textfield.component.html',
  styleUrls: ['./popupover-textfield.component.css']
})
export class PopupoverTextfieldComponent implements OnInit {


  _status = false;
  _class = [];
  _data = [];
  _ic_class = [];
  _is_ready = true;
  _event_name= "";
  _entered_value = 1;

  constructor(private popupoverTextfieldService:PopupoverTextfieldService) { 

    this.popupoverTextfieldService.dataSubject.subscribe(result=>{

      if(this._is_ready == true){
        if(result.status==true){
          this._status = true; 
          this._ic_class  = [];
          this._class = [];
          this._entered_value = result.entered_value;
          this._is_ready = false;
          this._event_name = result.event;
         
          setTimeout(()=>{
            this._class.push("active");
            setTimeout(()=>{
              this._ic_class.push("active");
              this._is_ready = true;
             
            },500)
          },100);
          
        }else{
          this._ic_class.splice(this._ic_class.indexOf("active"),1);
          this._is_ready = false;
          setTimeout(()=>{
            this._class.splice(this._class.indexOf("active"),1);
            this._status = false;
            this._is_ready = true;
          },500);
        }
      }

    });
    
  }

  ngOnInit() {


  }

  closePopup(){
    this.popupoverTextfieldService.dataSubject.next({status:false});
  }

  onClickOk(){
    this.popupoverTextfieldService.dataSubject.next({status:false,event:this._event_name,entered_value:this._entered_value});
  }

}
