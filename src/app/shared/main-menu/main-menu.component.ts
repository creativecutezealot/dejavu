import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GameboardService } from '../../gameboard/gameboard.service';
import { Subject, Subscription } from 'rxjs';
import { NotificationsService } from '../notifications/notifications.service';
import { AlertboxService } from '../alertbox/alertbox.service';
import { Alertbox } from 'src/app/models/alertbox.model';
import { ContestService } from '../my-contests/contests.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<{ result: string }>();
  @Input('isTopBar') isTopBar = true;
  @Input('hideMenus') hideMenus = [];

  boxClass = 'slideInRight';
  isMain = true;
  isAccountSettings = false;
  isContests = false;
  notificationCountSubjectSubscription = new Subscription();
  hasUnreadFirendRequest = false;
  notifications_data: any;
  alertboxSubscription: Subscription;
  alertbox = new Alertbox();
  contestInvites = [];
  constructor(private router: Router,
    private gameboardService: GameboardService,
    private notificationService: NotificationsService,
    private alertboxService: AlertboxService,
    private contestService: ContestService
  ) {
    this.gameboardService.menu_status.subscribe(resp => {
      if (resp == false) {
        this.onClose();
      }
    })
  }

  ngOnInit() {

    this.notificationCountSubjectSubscription = this.notificationService.notificationCountSubject.subscribe(result => {
      this.notifications_data = result;

      if (this.notifications_data.new_friend_request_total > 0) {
        this.hasUnreadFirendRequest = true;
      } else {
        this.hasUnreadFirendRequest = false;
      }
    });

    this.contestService.invites().subscribe(r => {
      this.contestInvites = r["data"] ? r["data"] : []
    })
  }

  onClose() {
    this.boxClass = 'slideOutRight';
    this.closed.next({ result: "close" });

  }
  onMenuClick(sec: string) {
    if (sec == 'account-settings') {
      this.isAccountSettings = true;
      this.isMain = false;
    }
    if (sec == 'game-lobby') {
      this.router.navigate(['/lobby']);
    }
    if (sec == 'game-screen') {
      this.onClose();
    }
    if (sec == 'logout') {
      //localStorage.clear();
      localStorage.removeItem('token');
      localStorage.removeItem('auth_user_id');
      localStorage.removeItem('game_id');
      localStorage.removeItem('gameboard_view');
      localStorage.removeItem("button_pos");
      localStorage.removeItem("button_on");


      localStorage.removeItem('chip_selected');
      localStorage.removeItem('last_play_id');
      localStorage.removeItem('total_last_passline');
      localStorage.removeItem('max_pass_line_bets');
      this.router.navigate(['/login']);
    }


    if (['about', 'game-history', 'how-to-play', 'change-password', 'edit-profile', 'odds_rules', 'scores', 'friends-menu', 'groups-menu', 'my-contests', 'add-contest', 'contest-invites', 'contest-single', 'prop-bets', 'prop-bet-outcomes'].indexOf(sec) != -1) {
      this.boxClass = 'slideOutRight';
      setTimeout(() => {
        this.closed.next({ result: sec });
      }, 500);
    }

    if (sec == 'back-to-main') {
      this.isAccountSettings = false;
      this.isContests = false;
      this.isMain = true;
    }

    if (sec == 'delete-account') {
      console.log('success')
      this.alertbox.message = "Are you sure you want to delete your account?";
      this.alertbox.status = true;
      this.alertbox.hasButton = false;
      this.alertbox.hideCloseButton = false;
      this.alertbox.type = 'delete-account'
      this.alertboxService.alertbox.next(this.alertbox);
    }

    if (sec == 'contests') {
      this.isContests = true;
      this.isMain = false;
    }
  }//end

}
