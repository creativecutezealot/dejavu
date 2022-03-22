
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { App } from './models/app.model';

@Injectable()
export class AppService {

    public appStatus = new Subject<App>();
    public app: App;
    constructor() {
        this.appStatus.subscribe(app => {
            this.app = app;
        })
    }
}