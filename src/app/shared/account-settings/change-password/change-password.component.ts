import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Alertbox } from 'src/app/models/alertbox.model';
import { App } from 'src/app/models/app.model';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertboxService } from 'src/app/shared/alertbox/alertbox.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  @Output('closed') closed = new EventEmitter<boolean>();
  dataForm:FormGroup;
  boxClass:string = "bounceInDown";

  alertbox:Alertbox = new Alertbox();
  app: App = new App();
  alertboxSubscription: Subscription;
  appSubscription: Subscription;
  user: User;
  constructor(private authService: AuthService,
    private alertboxService: AlertboxService, 
    private appService: AppService) { 
      this.app = this.appService.app;
   
  }


  ngOnInit() {
    this.dataForm = new FormGroup({
      'password':new FormControl("",Validators.required),
      'password2':new FormControl("",Validators.required)
    });

  
  }//end

  onSubmit(){
    
    if(this.app.app_loading==false){
   
      if(this.dataForm.controls['password'].value != this.dataForm.controls['password2'].value){
        this.alertbox.message="Password did not match, please enter your password again.";
        this.alertbox.status = true;
        this.alertboxService.alertbox.next(this.alertbox);
        this.dataForm.get('password').setValue("");
        this.dataForm.get('password2').setValue("");
        document.getElementById('ch_password').focus();
        return false;
      }

      this.authService.update_password(this.dataForm.value).subscribe(resp=>{
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
        if(resp.success==true){
        this.user = resp.user;
        }
        this.dataForm.get('password').setValue("");
        this.dataForm.get('password2').setValue("");
        this.alertbox.message = resp.message; 
        this.alertbox.status = true;
        this.alertboxService.alertbox.next(this.alertbox);
      })

      this.app.app_loading = true;
      this.appService.appStatus.next(this.app);

    }//end
  }

  onClose(){
    this.boxClass = 'bounceOutUp';
    this.closed.next(true);
  
  }

}
