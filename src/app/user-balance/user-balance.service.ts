import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserBalanceService {
    constructor(private httpClient: HttpClient, private config: AppConfig, private authService: AuthService) {

    }
    getBalance() {

        let httpOptions = this.config.httpOptions;
        httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
        return this.httpClient.get<{ remaining: number }>(this.config.apiUrl + '/user_balance/get_balance', { headers: httpOptions });
    }
}