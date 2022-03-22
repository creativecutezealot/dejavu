import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameboardService } from 'src/app/gameboard/gameboard.service';
import { Games } from 'src/app/models/lobby/games.model';
import { PopupoverConfirmationService } from '../../popupover-confirmation/popupover-confirmation.service';
import { PropBetsService } from '../prop-bets.service';

@Component({
  selector: 'app-active-prop-bets',
  templateUrl: './active-prop-bets.component.html',
  styleUrls: ['./active-prop-bets.component.css']
})
export class ActivePropBetsComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<boolean>();
  @Input('selectedGame') selectedGame: Games;
  animateClass: string = "slideInRight";
  myBets = [];
  acceptedBets = [];
  judgeBets = [];
  current_page: string = "active-prop-bets";
  popupOverConfirmationSubscription = new Subscription();

  constructor(private gameboardService: GameboardService,
    private propBetsService: PropBetsService,
    private popupOverConfirmation: PopupoverConfirmationService) {
    this.popupOverConfirmationSubscription = this.popupOverConfirmation.dataSubject.subscribe(result => {
      console.log('popupOverConfirmation: ', result);
      if (result.event == "active_my_bet_detail") {
        if (result.response) {
        }
      } else if (result.event == "active_accepted_bet_detail") {
        if (result.response) {
        }
      } else if (result.event == "active_judge_bet_detail") {
        console.log("response: ", result.response);
        if (result.response) {
          let data = {
            _id: result.data._id,
            status: 4,
            type: 1,
            ended_at: new Date()
          };
          this.gameboardService.updatePropBets(data);
        } else {
          if (result.response === undefined) {
            let data = {
              _id: result.data._id,
              status: 4,
              type: 0,
              ended_at: new Date()
            };
            this.gameboardService.updatePropBets(data);
          }
          console.log('result.response: ');
        }
      }
    })
  }

  ngOnInit() {
    this.propBetsService.getProposedBets().subscribe(data => {
      console.log("propBets: ", data);
      this.myBets = data.filter(d => !d.is_freestyle);
    });
    this.propBetsService.getAcceptedBets().subscribe(data => {
      console.log("acceptedBets: ", data);
      this.acceptedBets = data.filter(d => !d.is_freestyle);
      this.judgeBets = data.filter(d => d.is_freestyle);
    });
  }

  ngOnDestroy() {
    this.popupOverConfirmationSubscription.unsubscribe();
  }

  onClose() {
    console.log(this.selectedGame)
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }

  onDetails(type: string, row) {
    if (type === "") return;
    if (!row) return;
    console.log('onDetails active prop bets: ', row, type);
    var your_points = 0;
    var message = "";
    if (row.is_freestyle) {
      your_points = row.to_win;
      message = "Did  " + row.sender[0].first_name + " " + row.sender[0].last_name + " win the bet?";
      this.popupOverConfirmation.dataSubject.next({ status: true, message: message, event: "active_judge_bet_detail", title: "Judge", data: row });
    } else {
      if (row.proposed_odds === "Even") {
        your_points = row.bet_amount;
      } else if (parseInt(row.proposed_odds) > 0) {
        your_points = Math.floor((parseInt(row.proposed_odds) / 100) * row.bet_amount);
      } else {
        your_points = Math.floor((100 / (parseInt(row.proposed_odds) * -1)) * row.bet_amount);
      }

      if (type === "my_bets") {
        message = "I bet my " + row.bet_amount + " diamonds to win " + your_points + " diamonds that " + row.player_team_options.value + " will " + row.will_result_in + ", " + row.with_timeframe + ".";

        if (row.max_takers > 1) {
          message += " Up to " + row.max_takers + " bets will be accepted.";
        }
        this.popupOverConfirmation.dataSubject.next({ status: true, message: message, event: "active_my_bet_detail", title: "Detail", data: row });
      } else if (type === "accepted_bets") {
        message = row.sender[0].first_name + " " + row.sender[0].last_name + " bet " + row.bet_amount + " of their diamonds against " + your_points + " of your diamonds that " + row.player_team_options.value + " will " + row.will_result_in + ", " + row.with_timeframe + ".";
        this.popupOverConfirmation.dataSubject.next({ status: true, message: message, event: "active_accepted_bets_detail", title: "Detail", data: row });
      } else {
        message = "Did " + row.sender[0].first_name + " " + row.sender[0].last_name + " win the bet?";
        this.popupOverConfirmation.dataSubject.next({ status: true, message: message, event: "active_judge_bet_detail", title: "Judge", data: row });
      }
    }

  }

}
