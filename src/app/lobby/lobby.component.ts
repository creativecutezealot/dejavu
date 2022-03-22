import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfig } from '../app.config';
import { AppService } from '../app.service';
import { App } from '../models/app.model';
import { User } from '../models/user.model';
import { AuthService } from '../auth/auth.service';
import { Alertbox } from '../models/alertbox.model';
import { AlertboxService } from '../shared/alertbox/alertbox.service';

import { from, Subscription } from 'rxjs';
import { GameboardService } from '../gameboard/gameboard.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../shared/notifications/notifications.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {

  app: App = new App();
  currentTab: string = 'single';
  current_user: User;
  alertbox: Alertbox = new Alertbox();
  alertboxSubscription: Subscription;
  playType: string = "single";
  page: string = 'game-in-progress';//game-in-progress leaderboard
  comps = "";
  mcClass = "";
  checkSession;
  menu_time_out;
  sub_comp;
  friends_menu_anim_class = "slideInRight";
  groups_menu_anim_class = "slideInRight";
  notificationCountSubjectSubscription = new Subscription();
  notifications_data: any;
  hasNotification = false;
  constructor(private config: AppConfig,
    private appService: AppService,
    private authService: AuthService,
    private alertboxService: AlertboxService,
    private router: Router,
    private gameboardService: GameboardService,
    private notificationService: NotificationsService
  ) {
    this.app = this.appService.app;
    this.appService.appStatus.subscribe((app) => {
      this.app = app;

    });
    this.app.bgClass = 'lobbybg';
    this.appService.appStatus.next(this.app);
    this.alertboxSubscription = this.alertboxService.alertbox.subscribe((alertbox) => {
      this.alertbox = alertbox
    });

    this.authService.verify_token().subscribe(data => {

      if (data.success == false) {
        this.alertbox.message = "Your session has expired, please login.";
        this.alertbox.status = true;
        this.alertboxService.alertbox.next(this.alertbox);
        this.authService.logout();
      }

    });


    this.notificationCountSubjectSubscription = this.notificationService.notificationCountSubject.subscribe(result => {
      this.notifications_data = result;

      if (this.notifications_data.total_notification > 0) {
        this.hasNotification = true;
      } else {
        this.hasNotification = false;
      }
    });


  }

  ngOnDestroy() {
    this.notificationCountSubjectSubscription.unsubscribe();
    setInterval(this.checkSession);
    this.alertboxSubscription.unsubscribe();
  }

  ngOnInit() {

    this.authService.update_fcm_token({ fcm_token: localStorage.getItem("fcm_token") }).subscribe((user) => {
      console.log("update_fcm_token user: ", user);
    });

    localStorage.removeItem("game_id");
    localStorage.removeItem("last_play_id");
    localStorage.removeItem("button_pos");
    localStorage.removeItem("button_on");
    localStorage.removeItem("chip_selected");

    this.gameboardService.init(true);

    this.notificationService.init();

    this.authService.me().subscribe((user) => {
      this.current_user = user;

    });

    this.playType = localStorage.getItem('playType');

    localStorage.removeItem('gameboard_view');

    this.checkSession = setInterval(() => {
      this.authService.verify_token().subscribe(data => {

        if (data.success == false) {
          this.alertbox.message = "Your session has expired, please login.";
          this.alertbox.status = true;
          this.alertboxService.alertbox.next(this.alertbox);
          this.authService.logout();
        }

      });

    }, 1000 * 60);
  }


  onSelectPlay(playType: string) {

    this.playType = playType;
    localStorage.setItem('playType', playType);
  }

  onClickLeaderboard(event) {
    this.page = 'leaderboard';
  }

  onUnderConstruct() {
    this.alertbox.message = "Under Construction";
    this.alertbox.status = true;
    this.alertboxService.alertbox.next(this.alertbox);
  }
  onCloseScores(arg) {
    if (arg == true) {
      this.gameboardService.getGameData();
      this.page = 'game-in-progress';
    }
  }




  onCloseMenu(event) {


    this.mcClass = "";
    this.app.bgClass = "lobbybg";
    this.appService.appStatus.next(this.app);

    if (["odds_rules", "scores", "edit-profile", 'change-password', 'how-to-play', 'game-history', 'about', 'friends-menu', 'groups-menu', 'my-contests', 'add-contest', 'contest-invites', 'contest-single', 'prop-bet-outcomes'].indexOf(event.result) != -1) {
      if (event.result === "prop-bet-outcomes") {
        this.sub_comp = event.result;
        setTimeout(() => {
          this.comps = "";
        }, 500);
      } else {
        this.comps = event.result;
        this.mcClass = "bluritem";
        this.app.bgClass = "lobbybg blur";
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

  onShowMenu(event) {

    if (this.mcClass == "") {
      this.comps = 'menu';
      this.mcClass = "active";
      //this.app.bgClass = "lobbybg blur";
      this.appService.appStatus.next(this.app);
    } else {
      this.mcClass = "";
      this.gameboardService.menu_status.next(false);
    }
  }



  onCloseDefault(arg) {


    this.mcClass = "";
    this.app.bgClass = "lobbybg";
    this.appService.appStatus.next(this.app);

    if (this.menu_time_out) {
      clearTimeout(this.menu_time_out);
    }
    this.menu_time_out = setTimeout(() => {
      this.comps = '';
    }, 500);
  }

  onClosePropBetsOutcome(e) {
    setTimeout(() => {
      this.sub_comp = "";
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
    this.comps = e;
    this.groups_menu_anim_class = "slideInLeft";
    setTimeout(() => {
      this.sub_comp = "";
    }, 500);
  }

}
