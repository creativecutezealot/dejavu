import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { GameboardService } from 'src/app/gameboard/gameboard.service';
import { Games } from 'src/app/models/lobby/games.model';
import { PopupoverConfirmationService } from '../../popupover-confirmation/popupover-confirmation.service';
import { PropBetsService } from '../prop-bets.service';

@Component({
  selector: 'app-available-prop-bets',
  templateUrl: './available-prop-bets.component.html',
  styleUrls: ['./available-prop-bets.component.css']
})
export class AvailablePropBetsComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<boolean>();
  @Input('selectedGame') selectedGame: Games;
  animateClass: string = "slideInRight";
  myBets = [];
  generalBets = [];

  current_page: string = "available-prop-bets";

  popupOverConfirmationSubscription = new Subscription();

  constructor(private gameboardService: GameboardService,
    private propBetsService: PropBetsService,
    private authService: AuthService,
    private popupOverConfirmation: PopupoverConfirmationService) {
    this.popupOverConfirmationSubscription = this.popupOverConfirmation.dataSubject.subscribe(result => {
      if (result.event == "available_just_for_me_detail") {
        console.log('popupOverConfirmation: ', result);
        if (result.response) {
        }
      } else {
        if (result.response) {
        }
      }
    })
  }

  ngOnInit() {
    this.propBetsService.getAvailableBets().subscribe(data => {
      console.log("getAvailableBets: ", data);
      this.myBets = data.filter(d => !d.all_watching_game && !d.is_freestyle);
      this.generalBets = data.filter(d => !d.all_watching_game && !d.is_freestyle);
    });
  }

  ngOnDestroy() {
    this.popupOverConfirmationSubscription.unsubscribe()
  }

  onClose() {
    console.log(this.selectedGame)
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }

  onDetails(type: string, row) {
    if (type === "") return;
    if (!row) return;
    console.log('onDetails: ', row);

    var your_points = 0;
    var message = "";
    if (row.is_freestyle) {
      your_points = row.to_win;
      if (type === "just_for_me") {
        message = "I bet my " + row.bet_amount + " diamonds to win " + your_points + " diamonds that " + row.event;
        if (row.max_takers > 1) {
          message += " Up to " + row.max_takers + " bets will be accepted.";
        }
        this.popupOverConfirmation.dataSubject.next({ status: true, message: message, event: "available_just_for_me_detail", title: "Detail" });
      } else {
        message = row.sender[0].first_name + " " + row.sender[0].last_name + " bet " + row.bet_amount + " of their diamonds against " + your_points + " of your diamonds that " + row.event + ".";
        this.popupOverConfirmation.dataSubject.next({ status: true, message: message, event: "available_general_prop_bets_detail", title: "Detail" });
      }
    } else {
      if (row.proposed_odds === "Even") {
        your_points = row.bet_amount;
      } else if (parseInt(row.proposed_odds) > 0) {
        your_points = Math.floor((parseInt(row.proposed_odds) / 100) * row.bet_amount);
      } else {
        your_points = Math.floor((100 / (parseInt(row.proposed_odds) * -1)) * row.bet_amount);
      }
      if (type === "just_for_me") {
        message = "I bet my " + row.bet_amount + " diamonds to win " + your_points + " diamonds that " + row.player_team_options.value + " will " + row.will_result_in + ", " + row.with_timeframe + ".";

        if (row.max_takers > 1) {
          message += " Up to " + row.max_takers + " bets will be accepted.";
        }
        this.popupOverConfirmation.dataSubject.next({ status: true, message: message, event: "available_just_for_me_detail", title: "Detail" });
      } else {
        message = row.sender[0].first_name + " " + row.sender[0].last_name + " sent you following offer: I bet my " + row.bet_amount + " diamonds vs your " + your_points + " diamonds that the " + row.player_team_options.value + " will " + row.will_result_in + ", " + row.with_timeframe + ".";
        if (row.max_takers > 1) {
          message += " The first " + row.max_takers + " takers will be accepted.";
        }
        this.popupOverConfirmation.dataSubject.next({ status: true, message: message, event: "available_general_prop_bets_detail", title: "Detail" });
      }
    }
  }

}
