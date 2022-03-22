
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/auth.service';
@Injectable()
export class GameEndService {

    constructor(private httpClient: HttpClient, private config: AppConfig, private authService: AuthService, private router: Router) {

    }

    getUserBets(game_table_id = null) {
        let httpOptions = this.config.httpOptions;
        httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
        return this.httpClient.get(this.config.apiUrl + "/bet/all?game_table=" + game_table_id ? game_table_id : localStorage.getItem('game_table_id'), { 'headers': httpOptions });
    }
}