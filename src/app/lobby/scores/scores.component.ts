import { Component, OnInit, OnDestroy, Output,EventEmitter } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { UsersService } from 'src/app/users/users.service';
import { Alertbox } from 'src/app/models/alertbox.model';
import { Subscription } from 'rxjs';
import { App } from 'src/app/models/app.model';
import { AlertboxService } from 'src/app/shared/alertbox/alertbox.service';
import { UserScores } from 'src/app/models/user_scores.model';


@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent implements OnInit {

  @Output('closed') closed = new EventEmitter<boolean>();
  app: App = new App();
  alertbox:Alertbox = new Alertbox();
  alertboxSubscription: Subscription;
  appSubscription: Subscription;
  user_scores:UserScores[];
  boxClass = "bounceInDown";
  chipValue = 0;
  rank = 0;
  loaded = false;
  isLoading = false;
  constructor(private usersService:UsersService,private alertService: AlertboxService) { 
       
  }


  ngOnInit() {
    this.isLoading = true;
    this.usersService.getTop().subscribe((resp)=>{
      this.isLoading = false;
      if(resp.success=true){
        this.user_scores = resp.data;
        this.loaded = true;
          this.user_scores.forEach((u,i) => {
              if(u._id==localStorage.getItem('auth_user_id')){
                this.rank = i + 1;
                this.chipValue = u.total;
              }
          });

          
      }else{
        this.alertbox.message = resp.message;
        this.alertbox.status = true;
        this.alertService.alertbox.next(this.alertbox);
      }
     
    })
  }
  onClose(event){
    this.boxClass = 'bounceOutUp';
    this.closed.next(true);
   /* setTimeout(()=>{
    
    },1000);*/
  }

  onReload(event){
    if(!this.isLoading){
      this.isLoading = true;
      this.usersService.getTop().subscribe((resp)=>{
        this.isLoading = false;
        if(resp.success=true){
          this.user_scores = resp.data;
          this.loaded = true;
            this.user_scores.forEach((u,i) => {
                if(u._id==localStorage.getItem('auth_user_id')){
                  this.rank = i + 1;
                  this.chipValue = u.total;
                }
            });
  
            
        }else{
          this.alertbox.message = resp.message;
          this.alertbox.status = true;
          this.alertService.alertbox.next(this.alertbox);
        }
       
      })
    }
   
  }
}
