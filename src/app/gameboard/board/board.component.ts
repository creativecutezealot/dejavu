import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { GameboardService } from '../gameboard.service';
import { Gameboard } from 'src/app/models/gameboard/gameboard.model';
import { Bets } from 'src/app/models/gameboard/bets.model';
import { Subscription } from 'rxjs';
import { Games } from 'src/app/models/lobby/games.model';
import { Plays } from 'src/app/models/gameboard/plays.model';
import { UserBalanceService } from 'src/app/user-balance/user-balance.service';
import { Router } from '@angular/router';
import { GameEnd } from 'src/app/models/gameboard/game-end.model';
import { Alertbox } from 'src/app/models/alertbox.model';
import { AlertboxService } from 'src/app/shared/alertbox/alertbox.service';
import { GameTable } from 'src/app/models/gameboard/game_table.model';
import { GameTablePlays } from 'src/app/models/gameboard/game_table_plays.model';
import { Players } from 'src/app/models/gameboard/players.model';
import * as socketIo from 'socket.io-client';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  @Output('showMenu') showMenu = new EventEmitter<boolean>();
  @Output('showGameEnd') showGameEnd = new EventEmitter<GameEnd>();
  @Output('showPropBets') showPropBets = new EventEmitter<boolean>();
  @Input('mcClass') mcClass;
  @ViewChild('stadium', { static: false }) stadium: ElementRef;
  @ViewChild('passline_left', { static: false }) passline_left: ElementRef;
  @ViewChild('come_left', { static: false }) come_left: ElementRef;
  @ViewChild('bb', { static: false }) bb: ElementRef;
  @ViewChild('infield_fly', { static: false }) infield_fly: ElementRef;
  @ViewChild('ground_out', { static: false }) ground_out: ElementRef;
  @ViewChild('kk', { static: false }) kk: ElementRef;
  @ViewChild('fly_out', { static: false }) fly_out: ElementRef;
  @ViewChild('hit', { static: false }) hit: ElementRef;
  @ViewChild('first_to_home', { static: false }) first_to_home: ElementRef;
  @ViewChild('place_8_ways', { static: false }) place_8_ways: ElementRef;
  chip_selected: number = 1;
  gameboard: Gameboard = new Gameboard();
  total_bet: number = 0;
  bets: Bets[];
  gameboardStatusSubscription: Subscription;
  alertboxSubscription: Subscription;
  betsStatusSubscription: Subscription;
  diamondsStatusSubscription: Subscription;
  selectedGameSubscription: Subscription;
  selectedGame: Games;
  gameTable: GameTable;
  lastPlays: Plays;
  currentBalls = 0;
  currentStrikes = 0;
  button_on = 0;
  button_pos_class = '';
  button_pos = '';
  chip_active = false;
  chip_temp_pos;
  user_balance = 0;
  user_remaining_balance = 0;
  user_remaining_diamonds = 0;
  total_bets = 0;
  number_of_pitches = 0;
  game_table_id = '';

  bets_result_class = [];
  total_bets_chip = [];
  ifUserWon = false;

  last_current_inning = -1;
  last_play_id = 0;

  game_end_data: GameEnd = new GameEnd();
  isUserLost = false;
  is8ways = false;
  openFirstToHome = false;
  resetOuts = true;

  alertbox = new Alertbox();

  game_table_plays: GameTablePlays = new GameTablePlays();
  timeOutChecker;
  timeCountDown;
  HomeTeamRuns = 0;
  AwayTeamRuns = 0;
  isInitLoaded = false;
  isShowPasslinePopup = true;
  showPasslinePopupTimeout = 5000;
  showLastPlayList = false;
  listLastPlays = [];
  animateChipWin = [];

  didShow2OutRule = false;
  _first_base_class = '';
  _runner1: Players;
  passlineTimeout;

  showLoading: Boolean = false;
  winAmout = []

  constructor(
    private router: Router,
    private gameboardService: GameboardService,
    private userBalanceService: UserBalanceService,
    private alertboxService: AlertboxService
  ) {
    this.showLoading = true;

    this.onSetTimeout();

    this.game_table_id = localStorage.getItem('game_table_id');
    this.last_play_id = localStorage.getItem('last_play_id')
      ? parseInt(localStorage.getItem('last_play_id'))
      : 0;

    this.button_pos = localStorage.getItem('button_pos')
      ? localStorage.getItem('button_pos')
      : '';
    this.button_on = localStorage.getItem('button_on')
      ? parseInt(localStorage.getItem('button_on'))
      : 0;
    this.button_pos_class =
      this.button_pos != ''
        ? this.gameboardService.buttonConvertClass(this.button_pos)
        : '';

    this.alertboxSubscription = this.alertboxService.alertbox.subscribe(
      (alertbox) => {
        if (alertbox.hasEvent == 'check_field' && alertbox.status == false) {
          if (alertbox.fieldValue != '') {
            var sel_val = parseInt(alertbox.fieldValue);
            if (sel_val < 5) {
              this.chip_selected = 1;
            } else if (sel_val >= 5 && sel_val < 10) {
              this.chip_selected = 5;
            } else if (sel_val >= 10 && sel_val < 25) {
              this.chip_selected = 10;
            } else if (sel_val >= 25 && sel_val < 100) {
              this.chip_selected = 25;
            } else {
              this.chip_selected = 100;
            }

            localStorage.setItem(
              'chip_selected',
              this.chip_selected.toString()
            );
            this.gameboardService.gameboard.chip_selected = this.chip_selected;
            this.gameboardService.gameboardStatus.next(
              this.gameboardService.gameboard
            );
            this.gameboardService.lastPlayID = this.lastPlays.PlayID;
            this.gameboardService.onAddBet(
              this.currentBalls,
              this.currentStrikes,
              'passline',
              parseInt(alertbox.fieldValue),
              this.chip_selected
            );
            alertbox.fieldValue = '';
            this.alertboxService.alertbox.next(alertbox);
          }
        }
      }
    );

    this.gameboardService.gameTableSubject.subscribe((data) => {
      this.gameTable = data;
    });

    this.gameboardStatusSubscription = this.gameboardService.gameboardStatus.subscribe(
      (gameboard) => {
        this.gameboard = this.gameboardService.gameboard = gameboard;
      }
    );

    this.betsStatusSubscription = this.gameboardService.betsStatus.subscribe(
      (result) => {
        this.bets = result.bets;
        this.user_balance = result.user_balance;
        this.user_remaining_balance = result.user_remaining_balance;
        this.checkBalance();
        this.total_bets = 0;
        this.total_bets_chip['total_passline_bet'] = 0;
        this.total_bets_chip['total_strikeout_bet'] = 0;
        this.total_bets_chip['total_infield_fly_bet'] = 0;
        this.total_bets_chip['total_ground_out_bet'] = 0;
        this.total_bets_chip['total_hit_bet'] = 0;
        this.total_bets_chip['total_first_to_home_bet'] = 0;
        this.total_bets_chip['total_place_8_ways_bet'] = 0;
        this.total_bets_chip['total_fly_out_bet'] = 0;
        this.total_bets_chip['total_bb_bet'] = 0;
        this.total_bets_chip['total_come_bet'] = 0;
        this.bets.forEach((el) => {
          this.total_bets += el.amount;
          if (el.place == 'passline') {
            this.total_bets_chip['total_passline_bet'] += el.amount;
          }
          if (el.place == 'k') {
            this.total_bets_chip['total_strikeout_bet'] += el.amount;
          }
          if (el.place == 'infield_fly') {
            this.total_bets_chip['total_infield_fly_bet'] += el.amount;
          }
          if (el.place == 'ground_out') {
            this.total_bets_chip['total_ground_out_bet'] += el.amount;
          }
          if (el.place == 'hit') {
            this.total_bets_chip['total_hit_bet'] += el.amount;
          }
          if (el.place == 'fly_out') {
            this.total_bets_chip['total_fly_out_bet'] += el.amount;
          }
          if (el.place == 'bb') {
            this.total_bets_chip['total_bb_bet'] += el.amount;
          }
          if (el.place == 'come') {
            this.total_bets_chip['total_come_bet'] += el.amount;
          }
        });

        this.bets_result_class['passline_result_class'] = '';
        this.bets_result_class['fly_out_result_class'] = '';
        this.bets_result_class['strikeout_result_class'] = '';
        this.bets_result_class['infield_fly_result_class'] = '';
        this.bets_result_class['ground_out_result_class'] = '';
        this.bets_result_class['hit_result_class'] = '';
        this.bets_result_class['bb_result_class'] = '';
        this.bets_result_class['come_result_class'] = '';
        this.bets_result_class['first_to_home_result_class'] = '';
        this.bets_result_class['place_8_ways_result_class'] = '';

        this.bets_result_class['place_8_ways_result_amt'] = '';
        this.bets_result_class['first_to_home_result_amt'] = ''
        this.bets_result_class['passline_result_amt'] = '';
        this.bets_result_class['hit_result_amt'] = '';
        this.bets_result_class['strikeout_result_amt'] = '';
        this.bets_result_class['bb_result_amt'] = '';
        this.bets_result_class['fly_out_result_amt'] = '';
        this.bets_result_class['ground_out_result_amt'] = '';
        this.bets_result_class['infield_fly_result_amt'] = '';
        this.bets_result_class['come_result_amt'] = '';

        this.bets_result_class['place_8_ways_result_lose'] = false;
        this.bets_result_class['first_to_home_result_lose'] = false
        this.bets_result_class['passline_result_lose'] = false
        this.bets_result_class['hit_result_lose'] = '';
        this.bets_result_class['strikeout_result_lose'] = false
        this.bets_result_class['bb_result_lose'] = '';
        this.bets_result_class['fly_out_result_lose'] = false
        this.bets_result_class['ground_out_result_lose'] = false
        this.bets_result_class['infield_fly_result_lose'] = false
        this.bets_result_class['come_result_lose'] = false;

        this.ifUserWon = false;
        if (this.gameTable) {
          this.check2OutRule()
        }
      }
    );

    this.diamondsStatusSubscription = this.gameboardService.diamondsStatus.subscribe(
      (result) => {
        this.user_remaining_diamonds = result.user_remaining_diamonds;
        this.checkDiamonds();
      }
    );

    this.selectedGameSubscription = this.gameboardService.selectedGame.subscribe(
      (resp) => {
        // console.log('Here: ', resp);
        this.showLoading = false;
        if (!this.gameTable) {
          return false;
        }
        this.selectedGame = resp.games;
        if (this.selectedGame.HomeTeamRuns != 0) {
          this.HomeTeamRuns = this.selectedGame.HomeTeamRuns;
        }
        if (this.selectedGame.AwayTeamRuns != 0) {
          this.AwayTeamRuns = this.selectedGame.AwayTeamRuns;
        }
        this.lastPlays = resp.plays;
        this.number_of_pitches = resp.number_of_pitches;
        this.game_table_plays = resp.game_table_plays;
        if (this.selectedGame.Status == 'Final') {
          this.userLose();
          this.disableBetting();
          setTimeout(() => {
            this.game_end_data.game = this.selectedGame;
            this.showGameEnd.next(this.game_end_data);
          }, 3000);
          return false;
        }

        if (
          ['Suspended', 'Postponed', 'Canceled'].indexOf(
            this.selectedGame.Status
          ) != -1
        ) {
          setTimeout(() => {
            this.game_end_data.game = this.selectedGame;
            this.showGameEnd.next(this.game_end_data);
          }, 3000);
          return false;
        }

        if (this.selectedGame.Balls != null) {
          this.currentBalls = this.selectedGame.Balls;
        } else {
          this.currentBalls = 0;
        }
        if (this.selectedGame.Strikes != null) {
          this.currentStrikes = this.selectedGame.Strikes;
        } else {
          this.currentStrikes = 0;
        }

        // if (
        //   this.selectedGame.Balls == null &&
        //   this.selectedGame.Strikes == null
        // ) {
        //   this.disableBetting();
        // }

        // if (this.currentBalls <= 1 && this.currentStrikes <= 1) {
        if (this.currentBalls <= 2) {
          this.is8ways = true;
        } else {
          this.is8ways = false;
        }

        let hasRunner = this.game_table_plays && this.game_table_plays.runner.length > 0 ? this.game_table_plays.runner.findIndex(
          (x) => x.status == 0 && x.runnerOnFirst == true
        ) : -1;
        // console.log(this.selectedGame.RunnerOnFirst);
        if (
          (this.selectedGame.RunnerOnFirst &&
            this.game_table_plays.runner.length > 0) ||
          (this.selectedGame.RunnerOnFirst &&
            this.selectedGame.RunnerOnSecond &&
            hasRunner != -1)
        ) {
          // console.log(this.selectedGame.RunnerOnFirst);
          // console.log(this.selectedGame.RunnerOnSecond);
          // console.log(this.selectedGame.RunnerOnThird);
          // console.log(this.game_table_plays.runner.length);
          this.openFirstToHome = true;
        } else {
          this.openFirstToHome = false;
        }

        this.button_on = this.game_table_plays.button_on ? 1 : 0;
        this.button_pos = this.game_table_plays.button_pos;
        this.button_pos_class = this.gameboardService.buttonConvertClass(
          this.button_pos
        );

        // if (this.last_play_id != this.lastPlays.PlayID) {
        //   if (this.lastPlays.Runner1ID != null) {
        //     // call the runner

        //     this.gameboardService.load_runner(this.lastPlays.Runner1ID);
        //   }
        // }
        // console.log(this.game_table_plays);
        // console.log(this.lastPlays);
        // console.log(this.last_play_id);
        // console.log(this.bets);
        this.isBetOpen();
        if (
          this.lastPlays.Result != '' &&
          this.last_play_id != this.lastPlays.PlayID
        ) {
          this.gameboardService.getLastPlayList();

          if (!this.passlineTimeout) {
            clearTimeout(this.passlineTimeout);
          }
          this.passlineTimeout = setTimeout(() => {
            if (
              this.button_on == 0 &&
              (this.alertbox.status == undefined ||
                this.alertbox.status == false)
            ) {
              if (
                this.selectedGame.Status != 'Final' &&
                this.currentBalls == 0 &&
                this.currentStrikes == 0
              ) {
                // this.alertbox.message = 'Do you want to place a passline bet?';
                // this.alertbox.status = true;
                // this.alertbox.hasField = true;
                // this.alertbox.fieldValue = '';
                // this.alertbox.fieldPlaceholder = 'Enter amount';
                // this.alertbox.fieldType = 'number';
                // this.alertbox.buttonLabel = 'Place Bet';
                // this.alertboxService.alertbox.next(this.alertbox);
                // clearTimeout(this.passlineTimeout);
                // console.log('Show Passline');
              }
            }
            if (this.button_on == 1 && this.alertbox.status == true) {
              if (this.alertbox.type != '2out') {
                this.alertbox.err_msg = '';
                this.alertbox.status = false;
                this.alertbox.hasField = false;
                this.alertboxService.alertbox.next(this.alertbox);
              }
            }
          }, this.showPasslinePopupTimeout);

          if (this.game_table_plays.check_user_winner) {
            if (this.game_table_plays.check_user_winner.status == true) {
              if (this.total_bets_chip['total_passline_bet'] > 0) {
                this.ifUserWon = true;
                this.didShow2OutRule = false;
              }
            }
          } else if (
            (this.total_bets_chip['total_strikeout_bet'] > 0 &&
              this.lastPlays.Result == 'Strikeout') ||
            (this.total_bets_chip['total_infield_fly_bet'] > 0 &&
              this.lastPlays.Result == 'Infield Fly') ||
            (this.total_bets_chip['total_ground_out_bet'] > 0 &&
              this.lastPlays.Result == 'Ground Out') ||
            (this.total_bets_chip['total_hit_bet'] > 0 &&
              this.lastPlays.Result == 'Hit') ||
            (this.total_bets_chip['total_fly_out_bet'] > 0 &&
              this.lastPlays.Result == 'Fly Out') ||
            (this.total_bets_chip['total_bb_bet'] > 0 &&
              this.lastPlays.Result == 'Walk')
          ) {
            this.ifUserWon = true;
            this.didShow2OutRule = false;
          }
        }

        if (this.lastPlays) {
          if (
            this.lastPlays.Outs + this.lastPlays.NumberOfOutsOnPlay == 3 &&
            this.resetOuts == true &&
            this.isUserLost == false
          ) {
            //&& this.ifUserWon==false
            console.log('here');
            this.resetOuts = false;
            // this.userLose();
          }
          if (this.lastPlays.Outs + this.lastPlays.NumberOfOutsOnPlay != 3) {
            this.resetOuts = true;
          }
        }
        this.last_current_inning = this.selectedGame.Inning;
        this.last_play_id = this.lastPlays.PlayID;
        // console.log(this.lastPlays);
        localStorage.setItem('last_play_id', String(this.last_play_id));
      }
    );

    this.gameboardService.socket.on('game_response', (resp) => {
      // if(resp.type == "selectedGame"){
      //   var gs = JSON.parse(localStorage.getItem("games_started")) || [];

      //   if(!gs.includes(resp.games.GameID)){
      //     gs = [...gs, resp.games.GameID];
      //     localStorage.setItem("games_started", JSON.stringify(gs));
      //   }
      // }


      if (resp.type != 'list_game_in_progess_simulator') {
        //console.log(resp);
      }

      if (resp.type == 'force_reload_bets') {
        var uid = localStorage.getItem('auth_user_id');
        if (uid == resp.user._id) {
          this.gameboardService.getBet();
        }
      }

      // if (resp.type == "load_runner1" && resp.game_id == localStorage.getItem("game_id")) {
      //   console.log('Runner')
      //   console.log(resp.data)
      //   this._runner1 = resp.data;
      //   this._first_base_class = "active";
      //   setTimeout(() => {
      //     this._first_base_class = "";
      //   }, 5000);
      // }
      // if (resp.type == 'notify_2_out_rule' && this.didShow2OutRule == false) {
      // if (resp.type == 'notify_2_out_rule' && this.alertbox.type == '') {
      // // setTimeout(() => {
      //   console.log("2OutRUle")
      //   console.log(resp.bets)
      //   // this.didShow2OutRule = true;
      //   this.alertbox.message = resp.message;
      //   this.alertbox.status = true;
      //   this.alertbox.type = '2out';
      //   this.alertbox.hasButton = false;
      //   this.alertbox.hideCloseButton = true;
      //   this.alertbox.bets = resp.bets;
      //   this.alertbox.game_table = resp.game_table;
      //   this.alertboxService.alertbox.next(this.alertbox);
      // // }, 1000);
      // } g
      if (
        resp.type == 'list_game_in_progess_simulator' &&
        this.isInitLoaded == false
      ) {
        this.isInitLoaded = true;
        setTimeout(() => {
          this.gameboardService.loadSimulatorGameTable();
        }, 2000);
      } //end

      if (resp.type == 'last_play_list') {
        if (
          localStorage.getItem('games') == resp.games &&
          localStorage.getItem('auth_user_id') == resp.user_id
        ) {
          this.listLastPlays = resp.data;
        }
      }

      if (
        resp.type == 'reload_boards' &&
        this.gameTable._id == resp.game_table_id
      ) {
        console.log(resp)
        if (resp.remove_pos == 'passline') {
          console.log('here');
          this.ifUserWon = true;
          if (resp.placeLose) {
            this.bets_result_class['passline_result_class'] = 'fadeOutDown';
            this.bets_result_class['passline_result_amt'] = 'red fadeInfadeOut'
            if (resp.is_odds) {
              this.bets_result_class['passline_result_amt_val_odd'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['passline_result_amt_val'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['passline_result_odd'] = resp.is_odds
          } else {
            this.bets_result_class['passline_result_class'] = 'fadeOutDownToChip';
            this.bets_result_class['passline_result_amt'] = 'yellow fadeInfadeOut'
            if (resp.is_odds) {
              this.bets_result_class['passline_result_amt_val_odd'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['passline_result_amt_val'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['passline_result_odd'] = resp.is_odds
          }
        } else if (resp.remove_pos == 'k') {
          if (resp.placeLose) {
            this.bets_result_class['strikeout_result_class'] = 'fadeOutDown';
            this.bets_result_class['strikeout_result_amt'] = 'red fadeInfadeOut'
            // this.bets_result_class['strikeout_result_amt_val'] = ('-$'+resp.lose_amount).replace(/\.00$/,'');
            if (resp.is_odds) {
              this.bets_result_class['strikeout_result_amt_val_odd'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['strikeout_result_amt_val'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['strikeout_result_odd'] = resp.is_odds
          } else {
            this.bets_result_class['strikeout_result_class'] = 'fadeOutDownToChipHit';
            this.bets_result_class['strikeout_result_amt'] = 'yellow fadeInfadeOut'
            // this.bets_result_class['strikeout_result_amt_val'] = ('+$'+resp.win_amount).replace(/\.00$/,'');
            if (resp.is_odds) {
              this.bets_result_class['strikeout_result_amt_val_odd'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['strikeout_result_amt_val'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['strikeout_result_odd'] = resp.is_odds
          }
        } else if (resp.remove_pos == 'infield_fly') {
          if (resp.placeLose) {
            this.bets_result_class['infield_fly_result_class'] = 'fadeOutDown';
            this.bets_result_class['infield_fly_result_amt'] = 'red fadeInfadeOut'
            // this.bets_result_class['infield_fly_result_amt_val'] = ('-$'+resp.lose_amount).replace(/\.00$/,'');
            if (resp.is_odds) {
              this.bets_result_class['infield_fly_result_amt_val_odd'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['infield_fly_result_amt_val'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['infield_fly_result_odd'] = resp.is_odds
          } else {
            this.bets_result_class['infield_fly_result_class'] = 'fadeOutDownInfieldFly';
            this.bets_result_class['infield_fly_result_amt'] = 'yellow fadeInfadeOut'
            // this.bets_result_class['infield_fly_result_amt_val'] = ('+$'+resp.win_amount).replace(/\.00$/,'');
            if (resp.is_odds) {
              this.bets_result_class['infield_fly_result_amt_val_odd'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['infield_fly_result_amt_val'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['infield_fly_result_odd'] = resp.is_odds
          }
        } else if (resp.remove_pos == 'hit') {
          if (resp.placeLose) {
            this.bets_result_class['hit_result_class'] = 'fadeOutDown';
            this.bets_result_class['hit_result_amt'] = 'red fadeInfadeOut';
            // this.bets_result_class['hit_result_amt_val'] = ('-$'+resp.lose_amount).replace(/\.00$/,'');
            if (resp.is_odds) {
              this.bets_result_class['hit_result_amt_val_odd'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['hit_result_amt_val'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['hit_result_odd'] = resp.is_odds
          } else {
            this.bets_result_class['hit_result_class'] = 'fadeOutDownToChipHit';
            this.bets_result_class['hit_result_amt'] = 'yellow fadeInfadeOut';
            // this.bets_result_class['hit_result_amt_val'] = ('+$'+resp.win_amount).replace(/\.00$/,'');
            if (resp.is_odds) {
              this.bets_result_class['hit_result_amt_val_odd'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['hit_result_amt_val'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['hit_result_odd'] = resp.is_odds
          }
        } else if (resp.remove_pos == 'fly_out') {
          if (resp.placeLose) {
            this.bets_result_class['fly_out_result_class'] = 'fadeOutDown';
            this.bets_result_class['fly_out_result_amt'] = 'red fadeInfadeOut'
            // this.bets_result_class['fly_out_result_amt_val'] = ('-$'+resp.lose_amount).replace(/\.00$/,'');
            if (resp.is_odds) {
              this.bets_result_class['fly_out_result_amt_val_odd'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['fly_out_result_amt_val'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['fly_out_result_odd'] = resp.is_odds
          } else {
            this.bets_result_class['fly_out_result_class'] = 'fadeOutDownInfieldFly';
            this.bets_result_class['fly_out_result_amt'] = 'yellow fadeInfadeOut'
            // this.bets_result_class['fly_out_result_amt_val'] = ('+$'+resp.win_amount).replace(/\.00$/,'');
            if (resp.is_odds) {
              this.bets_result_class['fly_out_result_amt_val_odd'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['fly_out_result_amt_val'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['fly_out_result_odd'] = resp.is_odds
          }
        } else if (resp.remove_pos == 'bb') {
          if (resp.placeLose) {
            this.bets_result_class['bb_result_class'] = 'fadeOutDown';
            this.bets_result_class['bb_result_amt'] = 'red fadeInfadeOut'
            // this.bets_result_class['bb_result_amt_val'] = ('-$'+resp.lose_amount).replace(/\.00$/,'');
            // this.bets_result_class['bb_result_lose'] = true;
            if (resp.is_odds) {
              this.bets_result_class['bb_result_amt_val_odd'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['bb_result_amt_val'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['bb_result_odd'] = resp.is_odds
          } else {
            this.bets_result_class['bb_result_class'] = 'fadeOutDownToChipHit';
            this.bets_result_class['bb_result_amt'] = 'yellow fadeInfadeOut'
            // this.bets_result_class['bb_result_amt_val'] = ('+$'+resp.win_amount).replace(/\.00$/,'');
            if (resp.is_odds) {
              this.bets_result_class['bb_result_amt_val_odd'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['bb_result_amt_val'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['bb_result_odd'] = resp.is_odds
          }
        } else if (resp.remove_pos == 'ground_out') {
          if (resp.placeLose) {
            this.bets_result_class['ground_out_result_class'] = 'fadeOutDown';
            this.bets_result_class['ground_out_result_amt'] = 'red fadeInfadeOut'
            // this.bets_result_class['ground_out_result_amt_val'] = ('+$'+resp.lose_amount).replace(/\.00$/,'');
            // this.bets_result_class['ground_out_result_lose'] = true
            if (resp.is_odds) {
              this.bets_result_class['ground_out_result_amt_val_odd'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['ground_out_result_amt_val'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['ground_out_result_odd'] = resp.is_odds
          } else {
            this.bets_result_class['ground_out_result_class'] = 'fadeOutDownGroundOut';
            this.bets_result_class['ground_out_result_amt'] = 'yellow fadeInfadeOut';
            // this.bets_result_class['ground_out_result_amt_val'] = ('+$'+resp.win_amount).replace(/\.00$/,'');
            if (resp.is_odds) {
              this.bets_result_class['ground_out_result_amt_val_odd'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            } else {
              this.bets_result_class['ground_out_result_amt_val'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
            }
            this.bets_result_class['ground_out_result_odd'] = resp.is_odds
          }
        } else if (resp.remove_pos == 'place_8_ways') {
          if (resp.placeLose) {
            this.bets_result_class['place_8_ways_result_class'] = 'fadeOutDown';
            this.bets_result_class['place_8_ways_result_amt'] = 'red fadeInfadeOut'
            this.bets_result_class['place_8_ways_result_amt_val'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            this.bets_result_class['place_8_ways_result_lose'] = true;
          } else {
            this.bets_result_class['place_8_ways_result_class'] = 'fadeOutDownToChip';
            this.bets_result_class['place_8_ways_result_amt'] = 'yellow fadeInfadeOut'
            this.bets_result_class['place_8_ways_result_amt_val'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
          }
        } else if (resp.remove_pos == 'first_to_home') {
          if (resp.placeLose) {
            this.bets_result_class['first_to_home_result_class'] = 'fadeOutDown';
            this.bets_result_class['first_to_home_result_amt'] = 'red fadeInfadeOut';
            this.bets_result_class['first_to_home_result_amt_val'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
            // this.bets_result_class['first_to_home_result_lose'] = true;
          } else {
            this.bets_result_class['first_to_home_result_class'] = 'fadeOutDownToChipF2H';
            this.bets_result_class['first_to_home_result_amt'] = 'yellow fadeInfadeOut';
            this.bets_result_class['first_to_home_result_amt_val'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
          }

          this._runner1 = undefined;
          this.didShow2OutRule = false;
        } else if (resp.remove_pos == 'come') {
          if (resp.placeLose) {
            this.bets_result_class['come_result_class'] = 'fadeOutDown';
            this.bets_result_class['come_result_amt'] = 'red fadeInfadeOut'
            this.bets_result_class['come_result_amt_val'] = ('-$' + resp.lose_amount).replace(/\.00$/, '');
          } else {
            this.bets_result_class['come_result_class'] = 'fadeOutDownToChip';
            this.bets_result_class['come_result_amt'] = 'yellow fadeInfadeOut'
            this.bets_result_class['come_result_amt_val'] = ('+$' + resp.win_amount).replace(/\.00$/, '');
          }
        }

        // this.animateWin(resp.win_amount);

        setTimeout(() => {
          this.gameboardService.getBet();
          this.gameboardService.getUserRank();
          this.gameboardService.getDiamonds();
        }, 2500);
      }
    });
  }

  check2OutRule() {
    if (this.bets.length > 0) {
      var is2outRule = false;
      if (
        this.bets.findIndex(
          (x) =>
            ['ground_out', 'fly_out', 'k', 'infield_fly'].includes(
              x.button_pos
            ) &&
            x.place == 'passline' &&
            x.isOdds == false
        ) != -1
      ) {
        if (
          this.bets.findIndex(
            (x) =>
              ['ground_out', 'fly_out', 'k', 'infield_fly'].indexOf(x.place) !=
              -1
          ) != -1
        ) {
          is2outRule = true;
        }
      }

      if (is2outRule && this.alertbox.type == '') {
        this.alertbox.message = "There are now 2 Outs and your Pass Line and Come Line bets cannot both win. Please choose which bet you would like to keep active.";
        this.alertbox.status = true;
        this.alertbox.type = '2out';
        this.alertbox.hasButton = false;
        this.alertbox.hideCloseButton = true;
        this.alertbox.bets = this.bets;
        this.alertbox.game_table = this.gameTable._id;
        this.alertboxService.alertbox.next(this.alertbox);
      }
    }
  }

  userLose() {
    this.didShow2OutRule = false;
    this._runner1 = undefined;
    this.gameTable.total_last_passline = 0;
    this.gameTable.max_pass_line_bets = 0;
    this.isUserLost = true;
    this.ifUserWon = false;
    this.last_play_id = this.lastPlays.PlayID;
    localStorage.setItem('last_play_id', String(this.last_play_id));
    this.last_current_inning = this.selectedGame.Inning;
    console.log('lose')
    if (this.bets_result_class['passline_result_class'] == '') {
      this.bets_result_class['passline_result_class'] = 'animated fadeOutDown';
      this.bets_result_class['passline_result_amt'] = 'animated red fadeInfadeOut'
      this.bets_result_class['passline_result_lose'] = true;
    }
    if (this.bets_result_class['strikeout_result_class'] == '') {
      this.bets_result_class['strikeout_result_class'] = 'animated fadeOutDown';
      this.bets_result_class['strikeout_result_amt'] = 'animated red fadeInfadeOut'
      this.bets_result_class['strikeout_result_lose'] = true;
    }
    if (this.bets_result_class['infield_fly_result_class'] == '') {
      this.bets_result_class['infield_fly_result_class'] = 'animated fadeOutDown';
      this.bets_result_class['infield_fly_result_amt'] = 'animated red fadeInfadeOut'
      this.bets_result_class['infield_fly_result_lose'] = true;
    }
    if (this.bets_result_class['ground_out_result_class'] == '') {
      this.bets_result_class['ground_out_result_class'] = 'animated fadeOutDown';
      this.bets_result_class['ground_out_result_amt'] = 'animated red fadeInfadeOut'
      this.bets_result_class['ground_out_result_lose'] = true;
    }
    if (this.bets_result_class['hit_result_class'] == '') {
      this.bets_result_class['hit_result_class'] = 'animated fadeOutDown';
      this.bets_result_class['hit_result_amt'] = 'animated red fadeInfadeOut'
      this.bets_result_class['hit_result_lose'] = true;
    }
    if (this.bets_result_class['fly_out_result_class'] == '') {
      this.bets_result_class['fly_out_result_class'] = 'animated fadeOutDown';
      this.bets_result_class['fly_out_result_amt'] = 'animated red fadeInfadeOut'
      this.bets_result_class['fly_out_result_lose'] = true;
    }
    if (this.bets_result_class['bb_result_class'] == '') {
      this.bets_result_class['bb_result_class'] = 'animated fadeOutDown';
      this.bets_result_class['bb_result_amt'] = 'animated red fadeInfadeOut'
      this.bets_result_class['bb_result_lose'] = true;
    }
    if (this.bets_result_class['come_result_class'] == '') {
      this.bets_result_class['come_result_class'] = 'animated fadeOutDown';
      this.bets_result_class['come_result_amt'] = 'animated red fadeInfadeOut'
      this.bets_result_class['come_result_lose'] = true;
    }

    if (this.bets_result_class['first_to_home_result_class'] == '') {
      this.bets_result_class['first_to_home_result_class'] = 'animated fadeOutDown';
      this.bets_result_class['first_to_home_result_amt'] = 'animated red fadeInfadeOut';
      this.bets_result_class['first_to_home_result_lose'] = true;
    }
    if (this.bets_result_class['place_8_ways_result_class'] == '') {
      this.bets_result_class['place_8_ways_result_class'] =
        'animated fadeOutDown';
      this.bets_result_class['place_8_ways_result_amt'] = 'animated red fadeInfadeOut';
    }


    // setTimeout(() => {
    //   this.bets = [];
    //   this.button_on = 0;
    //   this.button_pos = '';
    //   this.button_pos_class = '';
    //   localStorage.removeItem('button_pos');
    //   localStorage.removeItem('button_on');
    //   this.isUserLost = false;
    //   this.total_bets = 0;
    //   this.total_bets_chip['total_passline_bet'] = 0;
    //   this.total_bets_chip['total_strikeout_bet'] = 0;
    //   this.total_bets_chip['total_infield_fly_bet'] = 0;
    //   this.total_bets_chip['total_ground_out_bet'] = 0;
    //   this.total_bets_chip['total_hit_bet'] = 0;
    //   this.total_bets_chip['total_first_to_home_bet'] = 0;
    //   this.total_bets_chip['total_place_8_ways_bet'] = 0;
    //   this.total_bets_chip['total_fly_out_bet'] = 0;
    //   this.total_bets_chip['total_bb_bet'] = 0;
    //   this.total_bets_chip['total_come_bet'] = 0;
    // }, 1000);
  }

  ngOnDestroy() {
    this.isInitLoaded = false;
    this.alertbox.err_msg = '';
    this.alertbox.status = false;
    this.alertbox.hasField = false;
    this.alertboxService.alertbox.next(this.alertbox);
    this.alertboxSubscription.unsubscribe();
    this.gameboardStatusSubscription.unsubscribe();
    this.betsStatusSubscription.unsubscribe();
    this.diamondsStatusSubscription.unsubscribe();
    this.selectedGameSubscription.unsubscribe();
    clearInterval(this.timeOutChecker);
    clearInterval(this.timeCountDown);
    clearInterval(this.gameboardService.timerplay);

    // var gId = +localStorage.getItem("game_id"),
    //     gs  = JSON.parse(localStorage.getItem('games_started'));

    // if(gs.includes(gId)){
    //   gs.splice(gs.indexOf(gId), 1);
    //   localStorage.setItem('games_started', JSON.stringify(gs));
    // }
  }

  ngOnInit() {
    if (!this.game_table_id) {
      this.router.navigate(['/lobby']);
    }

    this.gameboardService.getLastPlayList();
    this.chip_selected =
      localStorage.getItem('chip_selected') == null
        ? 1
        : parseInt(localStorage.getItem('chip_selected'));
    localStorage.setItem('chip_selected', this.chip_selected.toString());
    this.gameboardService.gameboard.chip_selected = this.chip_selected;
    this.gameboardService.gameboardStatus.next(this.gameboardService.gameboard);
    // this._first_base_class = 'active';
    // this.game_table_plays.runner = [
    //   {
    //     HitterId: 10008984,
    //     isScored: false,
    //     order: 1,
    //     player_first_name: 'Jared',
    //     player_last_name: 'Walsh',
    //     photoUrl:
    //       'https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/mlb/low-res/10008984.png'
    //   }
    // ];
  }

  animateWin(amount: number) {
    var anim_delay = 1000;
    this.animateChipWin = [];
    var chp_des = 'achp1';
    for (var i = 0; i < amount; i++) {
      if (amount < 5) {
        chp_des = 'achp1';
      } else if (amount >= 5 && amount < 10) {
        chp_des = 'achp5';
      } else if (amount >= 10 && amount < 25) {
        chp_des = 'achp10';
      } else if (amount >= 25 && amount < 100) {
        chp_des = 'achp25';
      } else {
        chp_des = 'achp100';
      }
      setTimeout(() => {
        this.animateChipWin.push({ class: chp_des });
      }, anim_delay);

      anim_delay += 100;
    }

    this.showPasslinePopupTimeout = anim_delay + 2000;

    setTimeout(() => {
      this.animateChipWin = [];
    }, anim_delay + 2000);
  }

  onSelectChip(val) {
    localStorage.setItem('chip_selected', val);
    this.chip_selected = this.gameboardService.gameboard.chip_selected = parseInt(
      val
    );
    this.gameboardService.gameboardStatus.next(this.gameboardService.gameboard);
  }

  onAddBet(event, val) {
    console.log('onAddBet: ', event, val, this.button_on, this.chip_selected);
    this.onSetTimeout();
    if (this.gameTable && this.betOpenAlert) {
      if (this.lastPlays) {
        this.gameboardService.lastPlayID = this.lastPlays.PlayID;
      }
      if (this.chip_selected == 0) {
        this.gameboardService.onAddBet(
          this.currentBalls,
          this.currentStrikes,
          val,
          this.chip_selected
        );
      } else {
        // if (val == 'passline') {
        //   if (this.button_on == 1) {
        //     // this.gameboardService.onAddBet(
        //     //   this.currentBalls,
        //     //   this.currentStrikes,
        //     //   val,
        //     //   this.chip_selected,
        //     //   this.chip_selected,
        //     //   true,
        //     //   this.button_pos
        //     // );
        //   } else {
        //     // this.gameboardService.onAddBet(
        //     //   this.currentBalls,
        //     //   this.currentStrikes,
        //     //   val,
        //     //   this.chip_selected
        //     // );
        //   }
        // } else if (val == 'come') {
        //   // this.gameboardService.onAddBet(
        //   //   this.currentBalls,
        //   //   this.currentStrikes,
        //   //   val,
        //   //   this.chip_selected
        //   // );
        // } else if (val == 'first_to_home') {
        //   this.gameboardService.onAddBet(
        //     this.currentBalls,
        //     this.currentStrikes,
        //     val,
        //     this.chip_selected
        //   );
        // } else if (val == 'place_8_ways') {
        //   if (this.is8ways == false) {
        //     return false;
        //   }
        //   // this.gameboardService.onAddBet(
        //   //   this.currentBalls,
        //   //   this.currentStrikes,
        //   //   val,
        //   //   this.chip_selected
        //   // );
        // } else {
        //   this.gameboardService.onAddBet(
        //     this.currentBalls,
        //     this.currentStrikes,
        //     val,
        //     this.chip_selected,
        //     this.chip_selected,
        //     true
        //   );
        // }
      } //end of else
    } //end
  }

  onChipDrag(event, val) {
    this.onSetTimeout();
    if (this.user_remaining_balance < parseInt(val)) {
      return false;
    }

    this.chip_temp_pos = {
      top: event.touches[0].clientY,
      left: event.touches[0].clientX
    };
    this.chip_active = true;
    localStorage.setItem('chip_selected', val);
    this.chip_selected = this.gameboardService.gameboard.chip_selected = parseInt(
      val
    );
    this.gameboardService.gameboardStatus.next(this.gameboardService.gameboard);
  }

  onChipMove(event) {
    this.onSetTimeout();
    this.chip_temp_pos = {
      top: event.touches[0].clientY,
      left: event.touches[0].clientX
    };
    this.isPlaced(this.chip_temp_pos, this.passline_left);
  }

  onChipDrop(event) {
    this.onSetTimeout();
    if (this.user_remaining_balance < this.chip_selected) {
      return false;
    }
    this.chip_active = false;
    this.onCheckPlaceBet();
  }

  preventFastBet: boolean = false;
  onCheckPlaceBet() {
    if (this.preventFastBet == false) {
      this.preventFastBet = true;
      this.gameboardService.lastPlayID = this.lastPlays
        ? this.lastPlays.PlayID
        : 0;
      if (this.isPlaced(this.chip_temp_pos, this.passline_left) == true) {
        if (this.button_on == 1) {
          if (this.checkBetLimit('passline', this.chip_selected)) {
            this.setBet('passline', this.chip_selected);
            this.gameboardService.onAddBet(
              this.currentBalls,
              this.currentStrikes,
              'passline',
              this.chip_selected,
              this.chip_selected,
              true,
              this.button_pos
            );
          }
        } else {
          if (this.checkBetLimit('passline', this.chip_selected)) {
            this.setBet('passline', this.chip_selected);
            this.gameboardService.onAddBet(
              this.currentBalls,
              this.currentStrikes,
              'passline',
              this.chip_selected
            );
          }
        }
      }
      if (this.isPlaced(this.chip_temp_pos, this.come_left) == true) {
        if (this.checkBetLimit('come', this.chip_selected)) {
          this.setBet('come', this.chip_selected);
          this.gameboardService.onAddBet(
            this.currentBalls,
            this.currentStrikes,
            'come',
            this.chip_selected
          );
        }
      }
      if (this.isPlaced(this.chip_temp_pos, this.first_to_home) == true) {
        console.log('this.first_to_home: ', this.first_to_home)
        if (this.checkBetLimit('first_to_home', this.chip_selected)) {
          this.gameboardService.onAddBet(
            this.currentBalls,
            this.currentStrikes,
            'first_to_home',
            this.chip_selected
          );
        }
      }
      if (this.isPlaced(this.chip_temp_pos, this.place_8_ways) == true) {
        console.log(this.place_8_ways)
        if (this.checkBetLimit('place_8_ways', this.chip_selected)) {
          this.gameboardService.onAddBet(
            this.currentBalls,
            this.currentStrikes,
            'place_8_ways',
            this.chip_selected
          );
        }
      }
      if (this.isPlaced(this.chip_temp_pos, this.bb) == true) {
        if (this.checkBetLimit('bb', this.chip_selected)) {
          this.setBet('bb', this.chip_selected);
          this.gameboardService.onAddBet(
            this.currentBalls,
            this.currentStrikes,
            'bb',
            this.chip_selected,
            this.chip_selected,
            true
          );
        }
      }
      if (this.isPlaced(this.chip_temp_pos, this.infield_fly) == true) {
        if (this.checkBetLimit('infield_fly', this.chip_selected)) {
          this.setBet('infield_fly', this.chip_selected);
          this.gameboardService.onAddBet(
            this.currentBalls,
            this.currentStrikes,
            'infield_fly',
            this.chip_selected,
            this.chip_selected,
            true
          );
        }
      }
      if (this.isPlaced(this.chip_temp_pos, this.ground_out) == true) {
        if (this.checkBetLimit('ground_out', this.chip_selected)) {
          this.setBet('ground_out', this.chip_selected);
          this.gameboardService.onAddBet(
            this.currentBalls,
            this.currentStrikes,
            'ground_out',
            this.chip_selected,
            this.chip_selected,
            true
          );
        }
      }
      if (this.isPlaced(this.chip_temp_pos, this.kk) == true) {
        if (this.checkBetLimit('k', this.chip_selected)) {
          this.setBet('k', this.chip_selected);
          this.gameboardService.onAddBet(
            this.currentBalls,
            this.currentStrikes,
            'k',
            this.chip_selected,
            this.chip_selected,
            true
          );
        }
      }
      if (this.isPlaced(this.chip_temp_pos, this.fly_out) == true) {
        if (this.checkBetLimit('fly_out', this.chip_selected)) {
          this.setBet('fly_out', this.chip_selected);
          this.gameboardService.onAddBet(
            this.currentBalls,
            this.currentStrikes,
            'fly_out',
            this.chip_selected,
            this.chip_selected,
            true
          );
        }
      }
      if (this.isPlaced(this.chip_temp_pos, this.hit) == true) {
        if (this.checkBetLimit('hit', this.chip_selected)) {
          this.setBet('hit', this.chip_selected);
          this.gameboardService.onAddBet(
            this.currentBalls,
            this.currentStrikes,
            'hit',
            this.chip_selected,
            this.chip_selected,
            true
          );
        }
      }

      setTimeout(() => {
        this.preventFastBet = false;
      }, 200);
    }
  }

  checkBetLimit(place, chip) {
    var i = this.bets.findIndex(x => x.place == place && x.isOdds == false);
    var j = this.bets.findIndex(x => x.place == place && x.isOdds == true);
    if (place == 'come') {
      if (i != -1) {
        if (this.bets[i].amount + chip > 100) {
          this.betLimitAlert();
          return false;
        }
      }
      return true;
    }
    if (place == 'passline') {
      if (this.button_on == 0) {
        if (i != -1) {
          if (this.bets[i].amount + chip > 100) {
            this.betLimitAlert();
            return false;
          }
        }
        return true;
      }
    }
    if (place == 'first_to_home') {
      return true;
    }
    if (place == 'place_8_ways') {
      if (i != -1) {
        if (this.bets[i].amount + chip > 100) {
          this.betLimitAlert();
          return false;
        }
      }
      return true;
    }
    if (j != -1) {
      if (i != -1) {
        if (this.bets[j].amount + chip > 300) {
          this.bet3XLimitAlert();
          return false;
        } else if (this.bets[j].amount + chip > 3 * this.bets[i].amount && this.bets[j].amount + chip <= 300) {
          this.bet3XLimitAlert();
          return false;
        } else {
          return true;
        }
      } else {
        if (this.bets[j].amount + chip > 300) {
          this.bet3XLimitAlert();
          return false;
        }
        return true;
      }
    } else {
      if (i != -1) {
        if (3 * this.bets[i].amount < chip) {
          this.bet3XLimitAlert();
          return false;
        }
      }
      return true;
    }
  }

  betLimitAlert() {
    this.alertbox.message = 'You have reached the maximum bet limit';
    this.alertbox.status = true;
    this.alertboxService.alertbox.next(this.alertbox);
  }

  bet3XLimitAlert() {
    this.alertbox.message = 'Maximum 3X odds have been placed.';
    this.alertbox.status = true;
    this.alertboxService.alertbox.next(this.alertbox);
  }

  isPlaced(pos: { top: number; left: number }, target: ElementRef) {
    var stadium_el = this.stadium.nativeElement;

    //console.log(target);
    var el = target.nativeElement;
    var el_m_h = el.offsetTop + el.offsetHeight + stadium_el.offsetTop;
    var el_m_y = el.offsetTop + stadium_el.offsetTop;

    var el_m_w = el.offsetLeft + el.offsetWidth + 20;
    var el_m_x = window.innerWidth >= 768 ? el.offsetLeft - 20 : el.offsetLeft;

    if (
      pos.top <= el_m_h &&
      pos.top >= el_m_y &&
      pos.left <= el_m_w &&
      pos.left >= el_m_x
    ) {
      return true;
    }
    return false;
  }

  setBet(place, chip) {
    let bet = null;
    let isOdds = false;

    if (this.button_on == 1 && place != 'come') {
      let oddsExceeded = false;
      let increased = false;
      this.bets.map((b, i) => {
        if (b['isOdds'] && b.place == place && !increased) {
          if (b.amount >= 3) {
            oddsExceeded = true;
            increased = true;
          } else {
            b.amount += chip;
            bet = b;
            this.bets.splice(i, 1);
            increased = true;
          }
        }
      });

      if (oddsExceeded) return;

      isOdds = true;
    } else {
      let increased = false;
      this.bets.reverse().map((b, i) => {
        if (b.place == place && !increased) {
          b.amount += chip;
          bet = b;
          this.bets.splice(i, 1);
          increased = true;
        }
      });
    }

    if (!bet) {
      bet = new Bets();
      bet.amount = chip;
      bet.last_selected_chip = chip;
      bet.place = place;

      if (isOdds) bet.isOdds = true;
    }

    this.bets.reverse().push(bet);
  }

  onShowMenu() {
    if (this.mcClass == '') {
      this.showMenu.next(true);
    } else {
      this.showMenu.next(false);
    }
  }

  onSetTimeout() {
    var max = 60 * 30;
    if (this.timeOutChecker) {
      clearTimeout(this.timeOutChecker);
    }
    this.timeOutChecker = setTimeout(() => {
      this.alertbox.message =
        'You have been kicked from the game for being not active for 10 minutes';
      this.alertbox.status = true;
      this.alertboxService.alertbox.next(this.alertbox);
      this.router.navigate(['/lobby']);
      this.gameboardService.setUserLose(
        this.game_table_id,
        'Player not active',
        0
      );
    }, 1000 * max);
  } //end

  onAddPropBet() {
    /* this.alertbox.status = true;
     this.alertbox.message = "Under Construction";
     this.alertboxService.alertbox.next(this.alertbox);*/

    this.showPropBets.next(true);
  }

  onLastPlayList(event) {
    this.showLastPlayList = !this.showLastPlayList;
  } //end

  selectBetFirstToHome: Number;
  showPlayer(i) {
    if (this.selectBetFirstToHome != i) {
      this.selectBetFirstToHome = i;
    } else {
      this.selectBetFirstToHome = undefined;
    }
  }

  isActive(i) {
    return i == this.selectBetFirstToHome ? true : false;
  }

  disableBetting() {
    this.bets_result_class['passline_result_class'] = '';
    this.bets_result_class['fly_out_result_class'] = '';
    this.bets_result_class['strikeout_result_class'] = '';
    this.bets_result_class['infield_fly_result_class'] = '';
    this.bets_result_class['ground_out_result_class'] = '';
    this.bets_result_class['hit_result_class'] = '';
    this.bets_result_class['bb_result_class'] = '';
    this.bets_result_class['come_result_class'] = '';
    this.bets_result_class['first_to_home_result_class'] = '';
    this.bets_result_class['place_8_ways_result_class'] = '';
    this.button_on = 0;
  }

  betOpenAlert = false;
  isBetOpen() {
    if (
      this.currentStrikes == 0 &&
      this.currentBalls == 0 &&
      this.betOpenAlert == false && this.alertbox.type == '' && !this.selectedGame.LockBet
    ) {
      this.betOpenAlert = true;
      // console.log('here');
      this.alertbox.message = 'Betting is now open';
      this.alertbox.status = true;
      this.alertbox.hasField = false;
      this.alertbox.buttonLabel = 'Place Bet';
      this.alertbox.hasButton = false;
      this.alertboxService.alertbox.next(this.alertbox);
    }

    if (this.currentStrikes > 0 || this.currentBalls > 0 || this.selectedGame.LockBet) {
      this.betOpenAlert = false;
      this.alertbox.status = false;
    }
  }

  bettingLineInfo() {
    console.log(this.selectedGame)
    this.betOpenAlert = true;
    let bet = 120
    let winAmount = this.selectedGame.BettingLine < 0 ? bet / (Math.abs(this.selectedGame.BettingLine) / 100) : bet * (Math.abs(this.selectedGame.BettingLine) / 100)
    this.alertbox.message =
      'A line of ' + this.selectedGame.BettingLine + ' means that a winning bet of $' + bet + ' will win $' + winAmount.toFixed(2);
    this.alertbox.status = true;
    this.alertbox.buttonLabel = 'Betting Line';
    this.alertboxService.alertbox.next(this.alertbox);
  }

  checkBalance() {
    if (this.user_remaining_balance < 1) {
      this.betOpenAlert = true;
      this.alertbox.message =
        'Would you like to add $1000 chips?';
      this.alertbox.status = true;
      this.alertbox.type = 'add_chips';
      this.alertboxService.alertbox.next(this.alertbox);
    }
  }

  checkDiamonds() {
    if (this.user_remaining_diamonds < 1) {
      this.betOpenAlert = true;
      this.alertbox.message =
        'Would you like to add $1000 diamonds?';
      this.alertbox.status = true;
      this.alertbox.type = 'add_diamonds';
      this.alertboxService.alertbox.next(this.alertbox);
    }
  }

  onJudgeBet() {
    console.log("onJudgeBet: ")
  }
}
