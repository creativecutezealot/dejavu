import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alertbox } from 'src/app/models/alertbox.model';
import { AlertboxService } from 'src/app/shared/alertbox/alertbox.service';
import { App } from 'src/app/models/app.model';
@Component({
  selector: 'app-odds-rules',
  templateUrl: './odds-rules.component.html',
  styleUrls: ['./odds-rules.component.css']
})
export class OddsRulesComponent implements OnInit {

  @Output('closed') closed = new EventEmitter<boolean>();
  app: App = new App();
  alertbox:Alertbox = new Alertbox();
  alertboxSubscription: Subscription;
  appSubscription: Subscription;
  boxClass = "bounceInDown";
  chipValue = 0;
  rank = 0;
  loaded = false;
  isLoading = false;
  oddRules = [
    {
      play: "Hit",
      payout: "6:5",
      active: "2 batters",
      exceptions: "None"
    },
    {
      play: "Strrikeout",
      payout: "6:5",
      active: "1 batter",
      exceptions: "None"
    },
    {
      play: "Ground Out",
      payout: "7:5",
      active: "2 batters",
      exceptions: "Sacrifice Bunt"
    },
    {
      play: "Fly Out",
      payout: "7:5",
      active: "2 batters",
      exceptions: "Sacrifice Fly Out"
    },
    {
      play: "Walk",
      payout: "2:1",
      active: "All batters",
      exceptions: "Intentional Walk"
    },
    {
      play: "Infield Fly Out",
      payout: "3:1",
      active: "All batters",
      exceptions: "None"
    }
  ]
  constructor(private alertService: AlertboxService) { 
       
  }


  ngOnInit() {
    console.log('here')
  }
  onClose(event){
    this.boxClass = 'bounceOutUp';
    this.closed.next(true);
   /* setTimeout(()=>{
    
    },1000);*/
  }

  onReload(event){
    // if(!this.isLoading){
    //   this.isLoading = true;
    //   this.usersService.getTop().subscribe((resp)=>{
    //     this.isLoading = false;
    //     if(resp.success=true){
    //       this.user_scores = resp.data;
    //       this.loaded = true;
    //         this.user_scores.forEach((u,i) => {
    //             if(u._id==localStorage.getItem('auth_user_id')){
    //               this.rank = i + 1;
    //               this.chipValue = u.total;
    //             }
    //         });
  
            
    //     }else{
    //       this.alertbox.message = resp.message;
    //       this.alertbox.status = true;
    //       this.alertService.alertbox.next(this.alertbox);
    //     }
       
    //   })
    // }
   
  }

}
