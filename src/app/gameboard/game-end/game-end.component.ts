import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { GameboardService } from '../gameboard.service';
import { GameTable } from 'src/app/models/gameboard/game_table.model';
import { Subscription } from 'rxjs';
import { GameEndService } from './game-end.services';

@Component({
  selector: 'app-game-end',
  templateUrl: './game-end.component.html',
  styleUrls: ['./game-end.component.css']
})
export class GameEndComponent implements OnInit, OnDestroy {
  @Output('closed') closed = new EventEmitter<{ result: string }>();
  @Input('data') data;
  boxClass = '';
  gameTable: GameTable;
  gameTableSubs: Subscription;
  constructor(private gameboardService: GameboardService, private ge: GameEndService) {
    this.gameboardService.loadGameTable();
    this.gameTableSubs = this.gameboardService.gameTableSubject.subscribe(game_table => {
      console.log(game_table)
      this.data.total_win = game_table.total_win;
      this.data.total_lose = game_table.total_lose;
      this.data.total_bets = game_table.total_bets
      this.boxClass = "bounceInDown";

    })

    // this.ge.getUserBets().subscribe(r => {
    //   console.log(r)
    //   if(r["data"] && r["data"].length > 0) {
    //     var b = r["data"];

    //     b.forEach(el => {
    //       this.gameTotal += el.amount
    //     });
    //   } 
    // })




  }

  ngOnDestroy() {

  }

  ngOnInit() {
  }



  onClose() {
    this.boxClass = 'bounceOutUp';
    setTimeout(() => {
      this.closed.next({ result: "close" });
    }, 900);
  }
}
