import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(private httpClient: HttpClient, private config: AppConfig, private authService: AuthService) {

  }

  searchUsers(q: string) {

    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<{ total_result: number, total_page: number, page: number, data: User[] }>(this.config.apiUrl + '/users/search?q=' + q, { headers: httpOptions });
  }

  sendFriendRequest(user_friend_id: string) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.post<{ message: string, status: boolean }>(this.config.apiUrl + '/users/friends/send-friend-request', {
      user_friend_id: user_friend_id
    }, { headers: httpOptions });

  }


  unfriend(id: string) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.post<{ message: string, status: boolean }>(this.config.apiUrl + '/users/friends/unfriend', {
      id: id
    }, { headers: httpOptions });

  }

  acceptFriend(id: string) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.post<{ message: string, status: boolean }>(this.config.apiUrl + '/users/friends/accept', {
      id: id
    }, { headers: httpOptions });
  }



  listFriends(q?: string, status?: boolean) {
    let httpOptions = this.config.httpOptions;
    httpOptions = httpOptions.append('mbn-access-token', this.authService.getToken());
    return this.httpClient.get<{ total_result: number, total_page: number, page: number, data: User[] }>(this.config.apiUrl + '/users/friends?q=' + q + "&status=" + status, { headers: httpOptions });
  }

}
