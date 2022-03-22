import { Component, OnInit } from '@angular/core';
import { GameboardService } from 'src/app/gameboard/gameboard.service';
import { UserBalanceService } from 'src/app/user-balance/user-balance.service';

@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.css']
})
export class MoneyComponent implements OnInit {

  remaining_balance:number;
  constructor(private userBalanceService:UserBalanceService, private gameboardService:GameboardService) {

   }

  ngOnInit() {
    this.gameboardService.init();
    this.gameboardService.socket.on('game_response', (resp) => {
      if(resp.type=="force_reload_bets"){
        var uid = localStorage.getItem("auth_user_id");
        if(uid==resp.user._id){
         this.loadBalance();
        }
      }
    });
    this.loadBalance();
  }


  loadBalance(){
    this.userBalanceService.getBalance().subscribe((resp)=>{
     
      this.remaining_balance = resp.remaining;
    });
  }

}
