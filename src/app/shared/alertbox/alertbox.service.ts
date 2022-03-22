import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/auth.service';
import { Alertbox } from '../../models/alertbox.model';
@Injectable()
export class AlertboxService {

    public alertbox = new Subject<Alertbox>();
    constructor(private httpClient: HttpClient, private config: AppConfig, private authService: AuthService, private router: Router) {

    }

    removeBet(data) {
        let httpOptions = this.config.httpOptions;
        httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
        return this.httpClient.post<any>(this.config.apiUrl + "/bet/remove", data, { 'headers': httpOptions });
    }

    removeAccount() {
        let httpOptions = this.config.httpOptions;
        httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
        return this.httpClient.post<any>(this.config.apiUrl + "/user/remove-account", null, { 'headers': httpOptions });
    }

    addChip() {
        let httpOptions = this.config.httpOptions;
        httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
        return this.httpClient.post<any>(this.config.apiUrl + "/user/add-chip", null, { 'headers': httpOptions });
    }

    addDiamond() {
        let httpOptions = this.config.httpOptions;
        httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
        return this.httpClient.post<any>(this.config.apiUrl + "/user/add-diamond", null, { 'headers': httpOptions });
    }


}