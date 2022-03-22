import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';
import { GameboardService } from 'src/app/gameboard/gameboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-rank',
  templateUrl: './user-rank.component.html',
  styleUrls: ['./user-rank.component.css']
})
export class UserRankComponent implements OnInit,OnDestroy {

  current_rank= 0;
  total_users = 0;
  userRankSubscription:Subscription = new Subscription();
  constructor(private usersService:UsersService,private gameboardService:GameboardService) {

   }

  ngOnInit() {
   this.usersService.getCurrentRank().subscribe(data=>{
     this.current_rank = data.rank;
     this.total_users = data.total_users;
   });

   this.userRankSubscription = this.gameboardService.userRankSubject.subscribe(data=>{
    this.current_rank = data.rank;
    this.total_users = data.total_users;
   });


  
  }
  ngOnDestroy(){
    this.userRankSubscription.unsubscribe();
  }

}
