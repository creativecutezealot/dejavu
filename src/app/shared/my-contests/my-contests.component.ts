import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NotificationsService } from '../notifications/notifications.service';
import { ContestService } from './contests.service';
@Component({
  selector: 'app-my-contests',
  templateUrl: './my-contests.component.html',
  styleUrls: ['./my-contests.component.css']
})
export class MyContestsComponent implements OnInit {

  @Output('onSelectMenu') select_menu = new EventEmitter<string>();
  @Output('closed') closed = new EventEmitter<boolean>();
  @Input('animateClass') animateClass: string = "slideInRight";
  _page_title = "../../../assets/images/txt-my-contests.svg";
  current_page: string = "my-contests";
  myContests = [];
  userId: String;
  constructor(private notificationService: NotificationsService, private contestService: ContestService) { }

  ngOnInit() {
    this.userId = localStorage.auth_user_id
    this.contestService.list('').subscribe(r => {
      this.myContests = r["data"] ? r["data"] : [];
      for (var ci = 0; ci < this.myContests.length; ci++) {
        let startDate = Date.parse(this.myContests[ci].contests[0].start_date);
        let endDate = Date.parse(this.myContests[ci].contests[0].end_date);
        if (startDate > Date.now()) {
          this.myContests[ci].statusLabel = "Scheduled";
        } else if (endDate < Date.now()) {
          this.myContests[ci].statusLabel = "Completed";
        } else {
          this.myContests[ci].statusLabel = "Live";
        }
      }
    })
  }

  onClose() {
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }

  onMenuClick(page: string, id = null) {
    switch (page) {
      case "contest-single":
        // TODO: HACK: Don't store the id/name in localstorage like this just to pass it to the contest detail page.  It's a hack.
        localStorage.cid = id;
        localStorage.contestName = this.myContests.find(c => c.contest_id === id).contests[0].name;
        this.animateClass = "slideOutLeft";
        this.select_menu.next(page);
        break;

      case "add-contest":
        this.animateClass = "slideOutLeft";
        this.select_menu.next(page);
        break;
    }

  }

  onSearchContest(e) {

  }

}
