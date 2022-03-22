import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/auth.service';
import { GroupsMembers } from 'src/app/models/groups-members.model';
import { Groups } from 'src/app/models/groups.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private httpClient: HttpClient, private config: AppConfig, private authService: AuthService) {

  }


  create(name: string) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());

    return this.httpClient.post<{ message: string, status: boolean }>(this.config.apiUrl + '/groups/create', {
      name: name
    }, { headers: httpOptions });

  }

  leave(group_id: string) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.post<{ message: string, status: boolean }>(this.config.apiUrl + '/groups/leave', {
      group_id: group_id
    }, { headers: httpOptions });
  }

  list(q?: string, status?: boolean) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<{ total_result: number, total_page: number, page: number, data: Groups[] }>(this.config.apiUrl + '/groups?q=' + q + "&status=" + status, { headers: httpOptions });
  }

  list_members(group_id: string, q?: string) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<{ total_result: number, total_page: number, page: number, data: GroupsMembers[] }>(this.config.apiUrl + '/groups/members/' + group_id + '?q=' + q, { headers: httpOptions });
  }

  search_users(q?: string) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<{ total_result: number, total_page: number, page: number, data: User[] }>(this.config.apiUrl + '/groups/users/search?q=' + q, { headers: httpOptions });

  }

  pending(q?: string) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<{ total_result: number, total_page: number, page: number, data: GroupsMembers[] }>(this.config.apiUrl + '/groups/pending?q=' + q, { headers: httpOptions });

  }

  invite_user(group_id?:string,user_id?:string){
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());

    return this.httpClient.post<{ message: string, status: boolean }>(this.config.apiUrl + '/groups/invite', {
      group_id: group_id,
      user_id: user_id
    }, { headers: httpOptions });
  }
  accept(id?:string){
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.post<{ message: string, status: boolean }>(this.config.apiUrl + '/groups/accept', {
      id:id
    }, { headers: httpOptions });
  }

  remove(id?:string){
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.post<{ message: string, status: boolean }>(this.config.apiUrl + '/groups/user/remove', {
      id:id
    }, { headers: httpOptions });
  }

}
