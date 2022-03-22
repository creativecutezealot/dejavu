import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { AuthService } from '../auth/auth.service';
import { UserScores } from '../models/user_scores.model';

@Injectable()
export class UsersService {
    constructor(private httpClient: HttpClient, private config: AppConfig, private authService: AuthService) {

    }
    getTop() {
        let httpOptions = this.config.httpOptions;
        httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
        return this.httpClient.get<{ success: boolean, data: UserScores[], message: string }>(this.config.apiUrl + '/users/top', { headers: httpOptions });
    }

    getCurrentRank() {
        let httpOptions = this.config.httpOptions;
        httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
        return this.httpClient.get<{ success: boolean, rank: number, total_users: number }>(this.config.apiUrl + '/users/getrank', { headers: httpOptions });
    }

    getUser(id: String) {
        let httpOptions = this.config.httpOptions;
        httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
        return this.httpClient.get<{ success: boolean, user: any }>(this.config.apiUrl + '/user/' + id, { headers: httpOptions });
    }
}
