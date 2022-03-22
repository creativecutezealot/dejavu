import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { GameboardService } from 'src/app/gameboard/gameboard.service';
import { Games } from 'src/app/models/lobby/games.model';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-prop-bet-confirmation',
  templateUrl: './prop-bet-confirmation.component.html',
  styleUrls: ['./prop-bet-confirmation.component.css']
})
export class PropBetConfirmationComponent implements OnInit, OnDestroy {
  @Input() propBetData: any;
  @Output('closed') closed = new EventEmitter<boolean>();
  @Input('selectedGame') selectedGame: Games;
  
  dataForm: FormGroup;
  boxClass: string = "bounceInDown";

  private subscription: Subscription;

  timeDifference = 120;
  seconds;
  minutes;

  SecondsInAMinute = 60;
  comment = "";

  proposer = "";
  your_points;

  constructor(private gameboardService: GameboardService, private usersService: UsersService) { }

  ngOnInit() {
    console.log("propBetData: ", this.propBetData);
    if (this.propBetData.is_freestyle) {
      this.your_points = this.propBetData.to_win;
    } else {
      if (this.propBetData.proposed_odds === "Even") {
        this.your_points = this.propBetData.bet_amount;
      } else if (parseInt(this.propBetData.proposed_odds) > 0) {
        this.your_points = Math.floor((parseInt(this.propBetData.proposed_odds) / 100) * this.propBetData.bet_amount);
      } else {
        this.your_points = Math.floor((100 / (parseInt(this.propBetData.proposed_odds) * -1)) * this.propBetData.bet_amount);
      }
    }
    this.dataForm = new FormGroup({
      'comment': new FormControl(""),
    });
    this.subscription = interval(1000)
      .subscribe(x => { this.getTimeDifference(); });
    this.usersService.getUser(this.propBetData.user_id).subscribe(data => {
      console.log("Proposer: ", data);
      this.proposer = data.user.first_name + " " + data.user.last_name;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {

  }

  onClose() {
    this.boxClass = 'bounceOutUp';
    this.closed.next(true);
  }

  onAccept() {
    console.log("onAccept: ", this.comment);
    let data = {
      _id: this.propBetData._id,
      status: 1,
      comment: this.comment
    };
    this.gameboardService.acceptPropBets(data);
    this.onClose();
  }

  onDecline() {
    console.log("onDecline: ");
    let data = {
      _id: this.propBetData._id,
      status: 2,
      comment: this.comment
    };
    this.gameboardService.declinePropBets(data);
    this.onClose();
  }

  onExpire() {
    console.log("onExpire: ");
    let data = {
      _id: this.propBetData._id,
      status: 3,
    };
    this.gameboardService.updatePropBets(data);
    this.onClose();
  }

  private getTimeDifference() {
    this.timeDifference--;
    if (this.timeDifference <= 0) this.onExpire();
    this.allocateTimeUnits(this.timeDifference);
  }
  
  private allocateTimeUnits(timeDifference) {
    this.seconds = Math.floor((timeDifference) % this.SecondsInAMinute);
    this.minutes = Math.floor((timeDifference - this.seconds) / this.SecondsInAMinute);
  }

}
