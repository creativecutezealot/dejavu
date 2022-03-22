import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CreateAccountService } from './create-account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertboxService } from 'src/app/shared/alertbox/alertbox.service';
import { Alertbox } from 'src/app/models/alertbox.model';
import { AppService } from 'src/app/app.service';
import { App } from 'src/app/models/app.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit,OnDestroy {
  is_active:boolean;
  dataForm: FormGroup;
 
  alertbox:Alertbox = new Alertbox();
  app: App = new App();
  alertboxSubscription: Subscription;
  constructor(private createAccountService: CreateAccountService,
    private alertboxService: AlertboxService, 
    private appService: AppService) { 
      
    }
  
  ngOnInit() {
    this.createAccountService.is_active.subscribe((is_active)=>this.is_active = is_active);
    this.dataForm = new FormGroup({
      'first_name':new FormControl("",Validators.required),
      'last_name':new FormControl("",Validators.required),
      'email':new FormControl("",[Validators.required,Validators.email]),
      'password':new FormControl("",Validators.required),
      'display_name':new FormControl("",Validators.required)
    });
   this.alertboxSubscription =  this.alertboxService.alertbox.subscribe((alertbox)=>{
      if(alertbox.hasEvent){
        if(alertbox.hasEvent=="close_signup" && alertbox.status == false){
          this.alertbox.messageClass = "";
          this.alertbox.hideCloseButton = false;
          this.alertbox.hasButton = false;
          this.alertboxService.alertbox.next(this.alertbox);
          this.onClose();
          
        }
      }
    })
    
  }

  ngOnDestroy(){
    if(this.alertboxSubscription){
    this.alertboxSubscription.unsubscribe();
    }
  }

  onSubmit(){
    this.app.app_loading = true;
    this.appService.appStatus.next(this.app);
    let accountData = {
      ...this.dataForm.value,
      fcm_token: localStorage.getItem("fcm_token")
    };
    this.createAccountService.submit(accountData).subscribe((data)=>{
      this.app.app_loading = false;
      this.appService.appStatus.next(this.app);
      if(data.success){
          this.alertbox.message = data.message;
          this.alertbox.status = true;
          this.alertbox.hasEvent = "close_signup";
          this.alertbox.messageClass = "alignCenter";
          this.alertbox.hideCloseButton = true;
          this.alertbox.hasButton = true;
          this.dataForm.reset();
      }else{
          this.alertbox.message = data.message;
          this.alertbox.status = true;
      }
  
      this.alertboxService.alertbox.next(this.alertbox);
    },(error)=>{
      this.app.app_loading = false;
      this.appService.appStatus.next(this.app);
    });
  }

  onClose(){
    this.is_active = false;
    
    this.createAccountService.is_active.next(this.is_active);
  }

}
