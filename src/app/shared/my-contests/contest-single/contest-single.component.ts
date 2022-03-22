import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContestService } from '../contests.service';

@Component({
  selector: 'app-contest-single',
  templateUrl: './contest-single.component.html',
  styleUrls: ['./contest-single.component.css']
})
export class ContestSingleComponent implements OnInit {
  @Output('onSelectMenu') select_menu = new EventEmitter<string>();
  @Output('closed') closed = new EventEmitter<boolean>();
  @Input('animateClass') animateClass: string = "slideInRight";
  constructor(private contestService: ContestService) { }

  players = []
  myRank = 0;
  balance = 0;
  name = "";
  myContests = [];
  startDate = '';
  startTime = '';
  endDate = '';
  contest_end = false;
  ngOnInit() {
    if (localStorage.cid) {
      console.log(localStorage.cid)
      // TODO: HACK: Get contest name from state store instead of temporarily storing it in localStorage
      this.name = localStorage.contestName;
      this.contestService.getRanks(localStorage.cid).subscribe(r => {
        this.players = r["data"] ? r["data"] : [];
        this.getMyRank()
      })
      this.contestService.list('').subscribe(r => {
        this.myContests = r["data"] ? r["data"] : [];
        console.log('myContests', this.myContests);
        for (var ci = 0; ci < this.myContests.length; ci++) {
          if (this.myContests[ci].contest_id === localStorage.cid) {
            let startDateTimeStamp = Date.parse(this.myContests[ci].contests[0].start_date);
            let startDate = new Date(startDateTimeStamp);
            let endDateTimeStamp = Date.parse(this.myContests[ci].contests[0].end_date);
            var endDate = new Date(endDateTimeStamp);
            endDate.setDate(endDate.getDate() - 1);
            this.startDate = startDate.toDateString();
            this.startTime = startDate.toTimeString().slice(0, startDate.toTimeString().indexOf('GMT'));
            this.endDate = endDate.toDateString();
            if (endDateTimeStamp <= Date.now()) {
              this.contest_end = true;
            } else {
              this.contest_end = false;
            }
            break;
          }
        }
      })
    }
  }

  onClose() {
    this.animateClass = "slideOutLeft";
    this.select_menu.next('my-contests');
  }

  getMyRank() {
    var r = this.players.findIndex(x => x.user_id == localStorage.auth_user_id)
    if (r != -1) {
      this.myRank = r + 1;
      this.balance = this.players[r].new_points;
    }
  }


}
