import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Alertbox } from 'src/app/models/alertbox.model';
import { App } from 'src/app/models/app.model';
import { Subscription } from 'rxjs';
import { AlertboxService } from 'src/app/shared/alertbox/alertbox.service';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit,OnDestroy {
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

  ngOnDestroy(){
   
  }

  ngOnInit() {
   this.dataForm = new FormGroup({
      'first_name':new FormControl("",Validators.required),
      'last_name':new FormControl("",Validators.required),
      'email':new FormControl("",[Validators.required,Validators.email]),
      'display_name':new FormControl("",Validators.required)
    });

    this.authService.me().subscribe((data)=>{
      this.user = data;
      this.dataForm.get('first_name').setValue(this.user.first_name);
      this.dataForm.get('last_name').setValue(this.user.last_name);
      this.dataForm.get('email').setValue(this.user.email);
      this.dataForm.get('display_name').setValue(this.user.display_name);
    })

  }
  onSubmit(){
    
    if(this.app.app_loading==false){
      this.app.app_loading = true;
      this.appService.appStatus.next(this.app);
      this.authService.update_profile(this.dataForm.value).subscribe(resp=>{
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
        if(resp.success==true){
        this.user = resp.user;
      
        }
        this.alertbox.message = resp.message; 
        this.alertbox.status = true;
        this.alertboxService.alertbox.next(this.alertbox);
      
      })
    }
  }

  onClose(){
    this.boxClass = 'bounceOutUp';
    this.closed.next(true);
   
  }
}
