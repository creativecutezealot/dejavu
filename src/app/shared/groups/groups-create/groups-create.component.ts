import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Alertbox } from 'src/app/models/alertbox.model';
import { App } from 'src/app/models/app.model';
import { AlertboxService } from '../../alertbox/alertbox.service';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'app-groups-create',
  templateUrl: './groups-create.component.html',
  styleUrls: ['./groups-create.component.css']
})
export class GroupsCreateComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<null>();
  @Input('events') _events = new Subject<{status:boolean}>();
  @Input('status') _status = false;


  private _alertbox = new Alertbox();
  private _in_progress  = false;
  private app:App = new App();
  _txtname:string = "";
  constructor(private alertboxService:AlertboxService, private groupsService: GroupsService,private appService:AppService) { 

    this.appService.appStatus.subscribe(result=>{
      this.app = result;
    })
  }

  ngOnInit() {
    
    this._events.subscribe(result=>{
      if(result.status==true){
        this._status = true;
        this._txtname  = "";
      }else{
        this._status = false;
      }
    });
  }


  onSave(){

    if(this._in_progress==false){

        if(this._txtname.toString()==""){
          this._alertbox.message = "Name is required"
          this._alertbox.status = true;
          this._alertbox.hasButton = true;
          this.alertboxService.alertbox.next(this._alertbox);
        }

        this._in_progress = true;
        this.app.app_loading = true;
        this.appService.appStatus.next(this.app);
        this.groupsService.create(this._txtname).subscribe(result=>{
          this._in_progress = false;
          this.app.app_loading = false;
          this.appService.appStatus.next(this.app);

          this._alertbox.message = "Successfully created a group";
          this._alertbox.status = true;
         this._alertbox.hasButton = true;
          this.alertboxService.alertbox.next(this._alertbox);
          this.closed.next(null);
        },error=>{
          this._in_progress = false;
          this.app.app_loading = false;
          this.appService.appStatus.next(this.app);

          this._alertbox.message = error.error.message;
          this._alertbox.status = true;
          this._alertbox.hasButton = true;
          this.alertboxService.alertbox.next(this._alertbox);
        
        });
    }

  }
 

}
