import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PropBetsService {

  constructor(private httpClient: HttpClient, private config: AppConfig, private authService: AuthService, private router: Router) {

  }

  getAllOptionsBySection(section: String) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<any>(this.config.apiUrl + "/prop-bets-options/get/" + section, { 'headers': httpOptions });
  }


  getAllOptionsTo() {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<any>(this.config.apiUrl + "/prop-bets-options/get-send-to-options", { 'headers': httpOptions });
  }

  getBatters(game_id) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<any>(this.config.apiUrl + "/batters/get?game_id=" + game_id, { 'headers': httpOptions });
  }

  getBets() {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<any>(this.config.apiUrl + "/propbet/all", { 'headers': httpOptions });
  }

  getProposedBets() {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<any>(this.config.apiUrl + "/propbet/proposed", { 'headers': httpOptions });
  }

  getAcceptedBets() {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<any>(this.config.apiUrl + "/propbet/accepted", { 'headers': httpOptions });
  }

  getAvailableBets() {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<any>(this.config.apiUrl + "/propbet/available", { 'headers': httpOptions });
  }

  getCompletedBets() {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<any>(this.config.apiUrl + "/propbet/completed", { 'headers': httpOptions });
  }

}
