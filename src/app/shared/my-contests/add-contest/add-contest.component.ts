import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Alertbox } from 'src/app/models/alertbox.model';
import { App } from 'src/app/models/app.model';
import { AlertboxService } from '../../alertbox/alertbox.service';
import { GroupsService } from '../../groups/groups.service';
import { ContestService } from '../contests.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-add-contest',
  templateUrl: './add-contest.component.html',
  styleUrls: ['./add-contest.component.css']
})
export class AddContestComponent implements OnInit {
  @Output('onSelectMenu') select_menu = new EventEmitter<string>();
  @Output('closed') closed = new EventEmitter<boolean>();
  @Input('animateClass') animateClass: string = "slideInRight";
  _page_title = "../../../assets/images/txt-new-contests.svg";
  isLoading = true;
  isSubmit = false;
  contestForm: FormGroup;
  _user_groups = [];
  private _alertbox = new Alertbox();
  private _in_progress = false;
  private app: App = new App();
  constructor(private fb: FormBuilder, private contestService: ContestService, private groupsService: GroupsService, private alertboxService: AlertboxService, private appService: AppService) { }

  ngOnInit() {
    this.contestForm = this.fb.group({
      name: ['', Validators.required],
      group_id: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    })
    this.isLoading = true;
    this.getUserGroups()
  }

  getUserGroups() {
    this.groupsService.list('').subscribe(result => {
      this._user_groups = result.data;
      this.isLoading = false;
    });
  }

  get fc() { return this.contestForm.controls; }

  onSubmitContest() {
    console.log('Clicked')
    if (this.isSubmit == false) {
      this._in_progress = true;
      this.app.app_loading = true;
      this.appService.appStatus.next(this.app);
      this.isSubmit = true;
      this.checkForm()
    }
  }

  checkForm() {
    if (this.contestForm.invalid) {
      this._in_progress = false;
      this.app.app_loading = false;
      this.appService.appStatus.next(this.app);
      this.isSubmit = false;
      console.log(this.contestForm)
      this._alertbox.message = "Please complete the form";
      this._alertbox.status = true;
      this._alertbox.hasButton = true;
      this.alertboxService.alertbox.next(this._alertbox);
    } else {

      let end_date = new Date();
      end_date.setDate(this.fc.end_date.value.getDate() + 1);
      end_date.setHours(5, 0, 0, 0);
      console.log('end_date: ', end_date);
      // TODO: HACK: Figure out how to properly do this with the validation framework
      // Check start / end dates
      if (this.fc.start_date.value > this.fc.end_date.value) {
        this._in_progress = false;
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
        this.isSubmit = false;
        console.log(this.contestForm)
        this._alertbox.message = "Start date cannot be later than end date";
        this._alertbox.status = true;
        this._alertbox.hasButton = true;
        this.alertboxService.alertbox.next(this._alertbox);
        return;
      }

      // TODO: HACK: This is not precise enough as a rule.  Need specific elaboration on how far in the future the date needs to be
      if (end_date < new Date()) {
        this._in_progress = false;
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
        this.isSubmit = false;
        console.log(this.contestForm)
        this._alertbox.message = "Start date must be in the future";
        this._alertbox.status = true;
        this._alertbox.hasButton = true;
        this.alertboxService.alertbox.next(this._alertbox);
        return;
      }


      // TODO: HACK: This is not precise enough as a rule.  Need specific elaboration on how far in the future the date needs to be
      if (end_date < new Date()) {
        this._in_progress = false;
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
        this.isSubmit = false;
        console.log(this.contestForm)
        this._alertbox.message = "End date must be in the future";
        this._alertbox.status = true;
        this._alertbox.hasButton = true;
        this.alertboxService.alertbox.next(this._alertbox);
        return;
      }

      // TODO: HACK: This is not precise enough as a rule.  Need specific elaboration on how far in the future the date needs to be
      if (end_date < this.fc.start_date.value) {
        this._in_progress = false;
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
        this.isSubmit = false;
        console.log(this.contestForm)
        this._alertbox.message = "Start date must not be later than end date";
        this._alertbox.status = true;
        this._alertbox.hasButton = true;
        this.alertboxService.alertbox.next(this._alertbox);
        return;
      }

      let data = {
        name: this.fc.name.value,
        group_id: this.fc.group_id.value,
        start_date: this.fc.start_date.value,
        end_date: end_date
      }
      this.contestService.create(data).subscribe(r => {
        if (r["status"]) {
          this._alertbox.message = "Successfully created a contest";
          this._alertbox.status = true;
          this._alertbox.hasButton = true;
          this.alertboxService.alertbox.next(this._alertbox);
          setTimeout(() => {
            this.select_menu.next('my-contests');
          }, 1000)
        } else {
          this._alertbox.message = r["message"];
          this._alertbox.status = true;
          this._alertbox.hasButton = true;
          this.alertboxService.alertbox.next(this._alertbox);
        }
      })
        .add(() => {
          this._in_progress = false;
          this.app.app_loading = false;
          this.appService.appStatus.next(this.app);
          this.isSubmit = false;
        })
    }
  }

  onClose() {
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }

}
