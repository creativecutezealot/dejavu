import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { App } from '../models/app.model';
import { Subscription, Subject } from 'rxjs';
import { GameboardService } from './gameboard.service';
import { AuthService } from '../auth/auth.service';
import { AlertboxService } from '../shared/alertbox/alertbox.service';
import { Alertbox } from '../models/alertbox.model';
import { Gameboard } from '../models/gameboard/gameboard.model';
import { Router } from '@angular/router';
import { GameEnd } from '../models/gameboard/game-end.model';
import { Games } from '../models/lobby/games.model';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.css']
})
export class GameboardComponent implements OnInit, OnDestroy {

  app: App = new App();

  gameboard: Gameboard = new Gameboard();
  appServiceSubscription: Subscription;
  gameboardServiceSubscription: Subscription;

  alertbox: Alertbox = new Alertbox();


  mcClass: string = "";

  game_end_data: GameEnd;
  comps = '';
  sub_comp = '';
  menu_time_out;
  props_bet_menu_anim_class = "slideInRight";

  friends_menu_anim_class = "slideInRight";
  groups_menu_anim_class = "slideInRight";
  notificationCountSubjectSubscription = new Subscription();
  notifications_data: any;

  propBetData: any;
  selectedGame: Games;

  constructor(private appService: AppService,
    private gameboardService: GameboardService,
    private authService: AuthService,
    private router: Router,
    private alertboxService: AlertboxService) {
    this.app = this.appService.app;
    this.appServiceSubscription = this.appService.appStatus.subscribe(app => {
      this.app = app;

    })
    this.app.bgClass = "gameboardbg";
    this.appService.appStatus.next(this.app);

    this.gameboardServiceSubscription = this.gameboardService.gameboardStatus.subscribe(gameboard => {
      this.gameboard = this.gameboardService.gameboard = gameboard;
    });
    this.gameboardService.gameboard.view = this.gameboard.view = localStorage.getItem("gameboard_view") == null ? "signup_chips" : localStorage.getItem("gameboard_view");
    this.gameboardService.gameboardStatus.next(this.gameboardService.gameboard);
    const game_id = localStorage.getItem("game_id");
    if (game_id == null) {
      this.router.navigate(["/lobby"]);
    }

    this.authService.verify_token().subscribe(data => {
      if (data.success == false) {
        this.authService.logout();
      }
    });

    this.gameboardService.propBets.subscribe(data => {
      console.log("propBets result: ", data, this.comps);
      this.propBetData = data;
      this.sub_comp = "prop-bet-confirmation";
    });

    this.gameboardService.selectedGame.subscribe(data => {
      this.selectedGame = data.games;
    });
  }
  ngOnDestroy() {
    this.appServiceSubscription.unsubscribe();
  }

  ngOnInit() {
    this.gameboardService.init();
  }



  onCloseMenu(event) {

    this.mcClass = "";
    this.app.bgClass = "gameboardbg";
    this.appService.appStatus.next(this.app);
    console.log("Here: ", event.result);

    if (["odds_rules", "scores", "edit-profile", 'change-password', 'how-to-play', 'game-history', 'about', 'friends-menu', 'groups-menu', 'my-contests', 'add-contest', 'contest-invites', 'contest-single', 'prop-bets', 'prop-bet-outcomes', 'available-prop-bets', 'active-prop-bets'].indexOf(event.result) != -1) {
      if (event.result == 'prop-bets' || event.result == 'prop-bet-outcomes' || event.result == 'available-prop-bets' || event.result == 'active-prop-bets') {
        this.sub_comp = event.result;
        setTimeout(() => {
          this.comps = "";
          this.props_bet_menu_anim_class = "";
        }, 500);
      } else {
        this.comps = event.result;
        this.mcClass = "blur";
        this.app.bgClass = "gameboardbg blur";
        this.friends_menu_anim_class = "slideInRight";
        this.groups_menu_anim_class = "slideInRight";
        this.appService.appStatus.next(this.app);
      }
    } else {
      if (this.menu_time_out) {
        clearTimeout(this.menu_time_out);
      }
      this.menu_time_out = setTimeout(() => {
        this.comps = '';
      }, 500);
    }
  }


  onSelectPropBetsMenu(e) {
    console.log("onSelectPropBetsMenu: ", e, this.comps);
    this.sub_comp = e;
    setTimeout(() => {
      this.comps = "";
      this.props_bet_menu_anim_class = "slideInRight";
    }, 500);
  }

  onClosePagePropBetsMenu(e) {
    this.comps = "prop-bets-menu";
    this.props_bet_menu_anim_class = "slideInLeft";
    setTimeout(() => {
      this.sub_comp = "";
    }, 500);
  }


  onShowPropBetsMenu(e) {
    this.props_bet_menu_anim_class = "slideInRight";
    this.comps = "prop-bets-menu";
    // this.mcClass = "blur";
    // this.app.bgClass = "gameboardbg blur";
    this.appService.appStatus.next(this.app);
  }

  onShowMenu(event) {

    if (event == true) {
      console.log(this.comps);
      this.comps = 'menu';
      this.mcClass = "active";
      //this.app.bgClass = "gameboardbg blur";
      //this.appService.appStatus.next(this.app);
    } else {
      this.gameboardService.menu_status.next(false);
    }
  }

  onShowGameEnd(event) {
    this.game_end_data = event;
    this.comps = 'game-end';
    this.mcClass = "blur";
    this.app.bgClass = "gameboardbg blur";
    this.appService.appStatus.next(this.app);
  }

  onCloseDefault(arg) {
    this.mcClass = "";
    this.app.bgClass = "gameboardbg";
    this.appService.appStatus.next(this.app);
    setTimeout(() => {
      this.comps = "";
    }, 500);
  }

  onCloseGameEnd(arg) {

    this.router.navigate(["/lobby"]);
  }


  onSelectFriendsMenu(e) {
    this.sub_comp = e;
    setTimeout(() => {
      this.comps = "";
      this.friends_menu_anim_class = "";
    }, 500);
  }

  onSelectGroupsMenu(e) {
    this.sub_comp = e;
    setTimeout(() => {
      this.comps = "";
      this.groups_menu_anim_class = "";
    }, 500);
  }

  onClosePageFriendsMenu(e) {
    this.comps = "friends-menu";
    this.friends_menu_anim_class = "slideInLeft";
    setTimeout(() => {
      this.sub_comp = "";
    }, 500);
  }

  onClosePageGroupsMenu(e) {
    this.comps = "groups-menu";
    this.groups_menu_anim_class = "slideInLeft";
    setTimeout(() => {
      this.sub_comp = "";
    }, 500);
  }

  onSelectContestMenu(e) {
    console.log(e)
    this.comps = e
  }

}
