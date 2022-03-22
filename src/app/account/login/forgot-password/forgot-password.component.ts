import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Alertbox } from 'src/app/models/alertbox.model';
import { App } from 'src/app/models/app.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertboxService } from 'src/app/shared/alertbox/alertbox.service';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  @Output('closed') closed = new EventEmitter<boolean>();
  dataForm:FormGroup;
  boxClass:string = "bounceInDown";

  alertbox:Alertbox = new Alertbox();
  app: App = new App();
  alertboxSubscription: Subscription;
  appSubscription: Subscription;
  user: User;
  step = 1;
  email = '';
  reset_code = '';
  constructor(private authService: AuthService,
    private alertboxService: AlertboxService, 
    private appService: AppService) { 
      this.app = this.appService.app;
   
  }


  ngOnInit() {
    this.dataForm = new FormGroup({
      'email':new FormControl("",[Validators.required,Validators.email]),
     
    });

  
  }//end

  onSubmit(){
    
    if(this.app.app_loading==false){
      var form_data;
      form_data = this.dataForm.value;
     
     if(this.step==2){
        form_data.email = this.email;
      }
     
       
     if(this.step==3){
      form_data.email = this.email;
      form_data.code = this.reset_code;
    }
      this.authService.forgot_password(form_data,this.step).subscribe(resp=>{
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
        if(resp.step==1){
          this.email = form_data.email;
          if(resp.success==true){
            this.dataForm.get('email').setValue("");
            this.step=2;
            this.dataForm = new FormGroup({
              'code':new FormControl("",Validators.required)
            });
          }
         
        }
        if(resp.step==2){
          if(resp.success==true){
            this.email = resp.email
            this.reset_code = resp.code;
            this.dataForm.get('code').setValue("");
            this.step=3;
            this.dataForm = new FormGroup({
              'password':new FormControl("",Validators.required),
              'password2':new FormControl("",Validators.required),
            });
          }
        }
        if(resp.step==3){
          if(resp.success==true){
            this.onClose();
          }
        }




        this.alertbox.message = resp.message; 
        this.alertbox.status = true;
        this.alertboxService.alertbox.next(this.alertbox);
      },error=>{
        console.log(error);
        this.alertbox.message = "Could not process your request"; 
        this.alertbox.status = true;
        this.alertboxService.alertbox.next(this.alertbox);
      });

      this.app.app_loading = true;
      this.appService.appStatus.next(this.app);

    }//end
  }

  onClose(){
    this.boxClass = 'bounceOutUp';
    setTimeout(()=>{
      this.closed.next(true);
    },1000);
  }
}
