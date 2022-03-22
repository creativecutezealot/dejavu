import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContestService {

  constructor(private httpClient: HttpClient, private config: AppConfig, private authService: AuthService) {

  }

  create(data) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.post<{message:string,status:boolean}>(this.config.apiUrl + '/contest/create', data, { headers: httpOptions });
  }

  list(q?: string) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get(this.config.apiUrl + '/contests?q=' + q, { headers: httpOptions });
  }

  invites() {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get(this.config.apiUrl + '/contest-invites', { headers: httpOptions });
  }

  acceptInvite(id) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.post<{message:string,status:boolean}>(this.config.apiUrl + '/contest/accept', {contest_id: id}, { headers: httpOptions });
  }

  getRanks(contest_id) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get(this.config.apiUrl + '/contest/rank?contest_id='+contest_id, { headers: httpOptions });
  }

}