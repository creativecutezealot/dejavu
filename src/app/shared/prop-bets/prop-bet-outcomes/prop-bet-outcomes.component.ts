import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { GameboardService } from 'src/app/gameboard/gameboard.service';
import { Games } from 'src/app/models/lobby/games.model';
import { PropBetsService } from '../prop-bets.service';

@Component({
  selector: 'app-prop-bet-outcomes',
  templateUrl: './prop-bet-outcomes.component.html',
  styleUrls: ['./prop-bet-outcomes.component.css']
})
export class PropBetOutcomesComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<boolean>();
  @Input('selectedGame') selectedGame: Games;
  animateClass: string = "slideInRight";
  prop_bets = [];
  user_auth_id;

  constructor(private gameboardService: GameboardService, private propBetsService: PropBetsService) { }

  ngOnInit() {
    this.user_auth_id = localStorage.getItem("auth_user_id");
    this.propBetsService.getCompletedBets().subscribe(data => {
      console.log("Completed Prop Bets: ", data);
      if (data && data.length > 0) {
        data.map(item => {
          if (item.proposed_odds === "Even") {
            item.diamonds = item.bet_amount;
          } else if (parseInt(item.proposed_odds) < 0) {
            item.diamonds = Math.floor((100 / Math.abs(parseInt(item.proposed_odds))) * item.bet_amount);
          } else {
            item.diamonds = Math.floor((parseInt(item.proposed_odds) / 100) * item.bet_amount);
          }
          return item;
        });
      }
      this.prop_bets = data;
    });
  }

  onClose() {
    console.log(this.selectedGame)
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }

}
