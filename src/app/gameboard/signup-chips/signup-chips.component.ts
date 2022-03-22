import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { App } from 'src/app/models/app.model';
import { Router } from '@angular/router';
import { GameboardService } from '../gameboard.service';
import { Gameboard } from 'src/app/models/gameboard/gameboard.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup-chips',
  templateUrl: './signup-chips.component.html',
  styleUrls: ['./signup-chips.component.css']
})
export class SignupChipsComponent implements OnInit,OnDestroy {

  gameboard:Gameboard = new Gameboard();
  gameboardServiceSubscription:Subscription;
  constructor(private router:Router,private gameboardService:GameboardService) {

    this.gameboardServiceSubscription = this.gameboardService.gameboardStatus.subscribe(gameboard=>{
      this.gameboard = gameboard;
    });

  }

  ngOnInit() {


   
  }

  ngOnDestroy(){
    this.gameboardServiceSubscription.unsubscribe();
  }

  onSelectMax(val){
    
    localStorage.setItem('maxBet',val);
    localStorage.setItem('gameboard_view',"in_game");
    this.gameboard.view = "in_game";
    this.gameboardService.gameboardStatus.next(this.gameboard);

    
  }

}
