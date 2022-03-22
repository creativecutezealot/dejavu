import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { AppConfig } from '../app.config';
import { Event } from './gameboard-event.model';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { GameResult } from '../models/lobby/game-result.model';
import { Gameboard } from '../models/gameboard/gameboard.model';
import { GameTable } from '../models/gameboard/game_table.model';
import { Bets } from '../models/gameboard/bets.model';
import { Alertbox } from '../models/alertbox.model';
import { AlertboxService } from '../shared/alertbox/alertbox.service';
import { Router } from '@angular/router';
import { App } from '../models/app.model';
import { AppService } from '../app.service';
import { Games } from '../models/lobby/games.model';
import { Plays } from '../models/gameboard/plays.model';
import { GameTablePlays } from '../models/gameboard/game_table_plays.model';
import { UserRank } from '../models/gameboard/user_rank.model';
import { HttpClient } from '@angular/common/http';
import { PropBetsService } from '../shared/prop-bets/prop-bets.service';
import { GroupsService } from '../shared/groups/groups.service';

@Injectable()
export class GameboardService {
  public socket;
  public menu_status = new Subject<boolean>();
  public gameboard: Gameboard = new Gameboard();
  public currentGame = new Subject<GameResult>();
  public gameTable: GameTable = new GameTable();
  public gameTableSubject = new Subject<GameTable>();
  public gameboardStatus = new Subject<Gameboard>();
  public userRankSubject = new Subject<UserRank>();
  public bets: Bets[];
  public betsStatus = new Subject<{
    bets: Bets[],
    user_balance: number,
    user_remaining_balance: number,
    user_remaining_diamonds: number
  }>();
  public diamondsStatus = new Subject<{
    user_remaining_diamonds: number
  }>();
  public selectedGame = new Subject<{
    games: Games,
    plays: Plays,
    game_table_id: string,
    number_of_pitches: number,
    game_table_plays: GameTablePlays
  }>();
  public propBets = new Subject<{
    status: boolean
  }>();

  alertbox: Alertbox = new Alertbox();
  hasDisconnected: boolean = false;
  playType: string = "";

  app: App = new App();
  lastgamesimulatorid = "";
  simulator_play_number = 0;
  lastPlayID = null;
  timerplay;

  batters = [];

  // last_play_id = 0;

  constructor(private config: AppConfig,
    private authService: AuthService,
    private alertboxService: AlertboxService,
    private appService: AppService,
    private router: Router,
    private httpClient: HttpClient,
    private propBetsService: PropBetsService,
    private groupsService: GroupsService
  ) {
    this.app = this.appService.app;
    this.appService.appStatus.subscribe((app) => {
      this.app = app;
    });
  }
  public init(forceReload?: boolean) {
    console.log('@GameboardServiceInit');
    this.socket = socketIo(this.config.socketUrl);
    this.socket.removeAllListeners();
    this.lastgamesimulatorid = "";

    this.onEvent(Event.CONNECT).subscribe(() => {
      console.log('@onConnect');
      this.getGameData();
      this.getBet();
      this.getDiamonds();
      this.getBatters();

      if (localStorage.getItem('game_id') != null && localStorage.getItem('game_id') != "") {
        setTimeout(() => {
          console.log("reconnected");
          this.loadGameTable();
          // this.getPlayByPlay(true);
          // this.getPlayByPlay();
        }, 2000);
      }

      this.hasDisconnected = false;
    });

    this.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log('@onDisconnect');
      this.hasDisconnected = true;
    });

    this.socket.on('game_response_error', (resp) => {
      // console.log('game_response_error'); console.log(resp); console.trace(); // TODO: Remove

      if (resp.forceLogout) {
        if (resp.forceLogout == true) {
          localStorage.clear();
          this.router.navigate(["/login"]);
        }
      }
    });

    this.socket.on('game_response', (resp) => {
      // console.log('socket: game_response'); console.log(resp); // console.trace(); // TODO: Remove
      if (resp.type == "list_game_in_progess") {
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
        this.currentGame.next(resp);
      } else if (resp.type == "list_game_in_progess_simulator") {
        this.simulator_play_number = resp.play_number;
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
        if (resp.data.length > 0) {
          if (this.lastgamesimulatorid != resp.data[0]._id) {
            this.lastgamesimulatorid = resp.data[0]._id;
            this.currentGame.next(resp);
          }
        } else {
          this.currentGame.next(resp);
        }

      } else if (resp.type == "create_game") {
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
        this.gameTable = resp.data;
        localStorage.setItem('game_table_id', this.gameTable._id);
        this.router.navigate(['/gameboard']);
        this.gameTableSubject.next(resp.data)
      } else if (resp.type == "update_game") {
        this.gameTableSubject.next(resp.data);
      } else if (resp.type == "bets") {
        this.bets = resp.data;
        this.betsStatus.next({
          bets: this.bets,
          user_balance: resp.user_balance,
          user_remaining_balance: resp.user_remaining_balance,
          user_remaining_diamonds: resp.user_remaining_diamonds
        });
      } else if (resp.type == "diamonds") {
        this.diamondsStatus.next({
          user_remaining_diamonds: resp.user_remaining_diamonds
        });
      } else if (resp.type == "play_by_play") {
        if (resp.games.GameID == localStorage.getItem('game_id')) {
          const game_table_id = localStorage.getItem('game_table_id');
          if (game_table_id) {
            resp.game_table_id = game_table_id;
            this.selectedGame.next({
              games: resp.games,
              plays: resp.plays,
              game_table_id: game_table_id,
              number_of_pitches: resp.number_of_pitches,
              game_table_plays: resp.game_table_plays
            });
          } else {
            this.selectedGame.next({
              games: resp.games,
              plays: resp.plays,
              game_table_id: "",
              number_of_pitches: resp.number_of_pitches,
              game_table_plays: resp.game_table_plays
            });
          }
          if (resp.plays.isUndo) {
            this.getBet()
          }

          // console.log('play_by_play: ', resp);

          // if (this.last_play_id === 0) {
          //   this.last_play_id = resp.plays.PlayID;
          // } else if (this.last_play_id !== resp.plays.PlayID || resp.games.Status === "Final") {
          //   this.playerTeamOptionCheck(resp);
          //   this.last_play_id = resp.plays.PlayID;
          // }

          this.getLastPlayList()
        }

        if (resp.isFinal == false) {
          //  this.getPlayByPlay();
        }

      } else if (resp.type == "error_notification") {
        if (resp.tag == 'insufficient_balance') {
          this.alertbox.message =
            'Would you like to add $1000 chips?';
          this.alertbox.status = true;
          this.alertbox.type = 'add_chips';
          this.alertboxService.alertbox.next(this.alertbox);
        } else if (resp.tag == 'insufficient_diamond') {
          this.alertbox.message =
            'Would you like to add $1000 diamonds?';
          this.alertbox.status = true;
          this.alertbox.type = 'add_diamonds';
          this.alertboxService.alertbox.next(this.alertbox);
        } else {
          this.alertbox.message = resp.message;
          this.alertbox.status = true;
          this.alertboxService.alertbox.next(this.alertbox);
        }

      }


    });

    this.socket.on('user_rank', (data) => {
      // console.log('user_rank'); console.log(data); console.trace(); // TODO: Remove
      this.userRankSubject.next(data);
    });

    this.socket.on('test', (resp) => {
      // console.log('test'); console.log(resp); console.trace(); // TODO: Remove
      alert(resp);
    });

    this.socket.on('submit_prop_bets_result', (data) => {
      console.log('submit_prop_bets_result: ', data);
      let auth_user_id = localStorage.getItem('auth_user_id');
      if (data.to_friend) {
        if (data.receiver_id === auth_user_id) {
          setTimeout(() => {
            this.propBets.next(data);
          }, 50);
        }
      } else {
        this.groupsService.list_members(data.receiver_id, "").subscribe(result => {
          console.log('submit_prop_bets_result1: ', result);
          if (result.data && result.data.length > 0) {
            const members = result.data;
            for (var i = 0; i < result.data.length - 1; i++) {
              const member = members[i];
              if (member.user_id !== auth_user_id) {
                setTimeout(() => {
                  this.propBets.next(data);
                }, 50);
              }
            }
          }
        })
      }
    });

    this.socket.on('update_prop_bets_result', (data) => {
      console.log("update_prop_bets_result: ", data);
      this.getDiamonds();
      let auth_user_id = localStorage.getItem('auth_user_id');
      if (data.user_id === auth_user_id) {

      }
      if (data.user_id !== auth_user_id && data.receiver) {
        if (data.status === 1) {
          this.alertbox.message = `${data.receiver.first_name} ${data.receiver.last_name} has accepted the prop bet. ${data.comment}`;
        } else if (data.status === 2) {
          this.alertbox.message = `${data.receiver.first_name} ${data.receiver.last_name} has declined the prop bet. ${data.comment}`;
        }

        this.alertbox.status = true;
        this.alertboxService.alertbox.next(this.alertbox);
      }
    });
  } //end function 

  public getUserRank() {
    // console.log('get_user_rank'); console.trace(); // TODO: Remove
    this.socket.emit('get_user_rank', {
      token: this.authService.getToken()
    })
  }

  public getGameData(page?: number) {
    const p = page ? page : 1;
    // console.log('get_game_data'); console.trace(); // TODO: Remove
    this.socket.emit('get_game_data', {
      token: this.authService.getToken(),
      page: p
    });
  }

  public getGameHistory(page: number) {
    // console.log('get_game_history'); console.trace(); // TODO: Remove
    this.socket.emit('get_game_history', {
      token: this.authService.getToken(),
      page: page
    })
  }

  public createGame(games: string) {
    this.app.app_loading = true;
    this.appService.appStatus.next(this.app);
    // console.log('create_game_table'); console.trace(); // TODO: Remove
    this.socket.emit("create_game_table", {
      'games': games,
      'token': this.authService.getToken()
    });
  }

  public loadGameTable() {
    const games = localStorage.getItem('games');
    // console.log('load_game_table'); console.trace(); // TODO: Remove
    this.socket.emit("load_game_table", {
      'games': games,
      'token': this.authService.getToken()
    });
  }

  public loadSimulatorGameTable() {
    const games = localStorage.getItem('games');
    // console.log('load_simulator_game_table'); console.trace(); // TODO: Remove
    this.socket.emit("load_simulator_game_table", {
      'game_id': games,
      'play_number': this.simulator_play_number,
      'token': this.authService.getToken()
    });
  }

  public onAddBet(balls: number, strikes: number, place: string, value: number, last_selected_chip?: number, isOdds?: boolean, button_pos?: string, deleteNow?: boolean) {
    const game_table_id = localStorage.getItem('game_table_id');
    const play_id = this.lastPlayID;
    // console.log('place_bet'); console.trace(); // TODO: Remove
    this.socket.emit('place_bet', {
      'game_table': game_table_id,
      'place': place,
      'amount': value,
      'play_id': play_id,
      'last_selected_chip': (last_selected_chip ? last_selected_chip : value),
      'isOdds': (isOdds ? isOdds : false),
      'button_pos': (button_pos ? button_pos : ""),
      'token': this.authService.getToken(),
      'balls': balls,
      'strikes': strikes,
      'deleteNow': deleteNow
    });
  }

  public getBet() {
    const game_table_id = localStorage.getItem('game_table_id');
    // console.log('get_bet'); console.trace(); // TODO: Remove
    this.socket.emit('get_bet', {
      'game_table': game_table_id,
      'token': this.authService.getToken()
    });
  }

  public getDiamonds() {
    this.socket.emit('get_diamonds', {
      'token': this.authService.getToken()
    });
  }

  public getPlayByPlay(load_init?: boolean) {
    const game_id = localStorage.getItem('game_id');
    const games = localStorage.getItem('games');
    const game_table_id = localStorage.getItem('game_table_id');

    if (this.timerplay) {
      clearInterval(this.timerplay);
    }

    // just a test
    // var gs = JSON.parse(localStorage.getItem('games_started'));
    // if(gs.includes(+game_id)){
    //   return;
    // }

    this.timerplay = setInterval(() => {
      // console.log('get_play_by_play'); console.trace(); // TODO: Remove
      this.socket.emit('get_play_by_play', {
        'token': this.authService.getToken(),
        'games': games,
        'game_id': game_id,
        'game_table_id': game_table_id,
        'load_init': load_init ? load_init : false
      });
    }, 1000);
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next())
    });
  }

  public setUserLose(game_table_id, result, play_id) {
    // console.log('on_set_user_lose'); console.trace(); // TODO: Remove
    this.socket.emit('on_set_user_lose', {
      'token': this.authService.getToken(),
      game_table_id: game_table_id,
      result: result,
      play_id: play_id
    });
  }

  public getLastPlayList() {
    const games = localStorage.getItem('games');
    // console.log('get_last_play_list'); console.trace(); // TODO: Remove
    this.socket.emit('get_last_play_list', {
      'token': this.authService.getToken(),
      games: games,
      play_number: this.simulator_play_number
    })
  }

  public load_runner(Runner1ID) {
    // console.log('load_runner'); console.trace(); // TODO: Remove

    this.socket.emit("load_runner", {
      'token': this.authService.getToken(),
      game_id: localStorage.getItem("game_id"),
      Runner1ID: Runner1ID
    })
  }

  public buttonConvertClass(str) {
    var array = {
      "Walk": "b_bb",
      "Strikeout": "b_k",
      "Ground Out": "b_ground_out",
      "Infield Fly": "b_infield_fly",
      "Hit": "b_hit",
      "Fly Out": "b_fly_out",
    };
    if (array[str] != undefined) {
      return array[str];
    }
    return "";
  }


  getUserBets(game_table_id = null) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<any>(this.config.apiUrl + "/bet/all?game_table=" + game_table_id ? game_table_id : localStorage.getItem('game_table_id'), { 'headers': httpOptions });
  }

  public submitPropBets(data) {
    this.socket.emit("submit_prop_bets", {
      token: this.authService.getToken(),
      game_id: localStorage.getItem("game_id"),
      ...data
    })
  }

  public updatePropBets(data) {
    console.log("updatePropBets: ", data);
    if (data === undefined || data === null) return;
    this.socket.emit("update_prop_bets", {
      token: this.authService.getToken(),
      game_id: localStorage.getItem("game_id"),
      ...data
    })
  }

  public acceptPropBets(data) {
    this.socket.emit("accept_prop_bets", {
      token: this.authService.getToken(),
      game_id: localStorage.getItem("game_id"),
      ...data
    })
  }

  public declinePropBets(data) {
    this.socket.emit("decline_prop_bets", {
      token: this.authService.getToken(),
      game_id: localStorage.getItem("game_id"),
      ...data
    })
  }

  getBatters() {
    const game_id = localStorage.getItem("game_id");
    if (game_id !== null) {
      this.propBetsService.getBatters(localStorage.getItem("game_id")).subscribe(result => {
        console.log("BATTERS")
        console.log(result.data)
        this.batters = result.data;
      })
    }
  }

  getNextBatterName(start_batter) {
    if (this.batters && this.batters.length > 0) {
      let index = this.batters.findIndex(batter => batter.Player.DraftKingsName === start_batter);
      if (index >= 0 && index < this.batters.length - 1) {
        let nextBatter = this.batters[index + 1];
        return nextBatter.Player.DraftKingsName;
      }
      return null;
    }
  }

  getNextBattersName(start_batter) {
    if (this.batters && this.batters.length > 0) {
      let index = this.batters.findIndex(batter => batter.Player.DraftKingsName === start_batter);
      if (index >= 0 && index < this.batters.length - 1) {
        let nextBatters = this.batters.slice(index + 1);
        return nextBatters.map(batter => batter.Player.DraftKingsName);
      }
      return null;
    }
  }

}