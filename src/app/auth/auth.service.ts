import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
@Injectable()
export class AuthService{
    token:string = "";
    user:User;
    constructor(private httpClient: HttpClient,private config: AppConfig,private router: Router){ }
    loginUser(data){
        return this.httpClient.post<{message:string,success:boolean,token:string,user:User}>(this.config.apiUrl+"/auth/signin",data,{'headers':this.config.httpOptions});
    }
    getToken(){
       return this.token;
    }
    isAuthenticated(){
        this.token = localStorage.getItem("token");
        return this.token !=null && this.token!="";
    }
    me(){
        let httpOptions = this.config.httpOptions;
        httpOptions =  httpOptions.append('mbn-access-token',this.getToken());
        return this.httpClient.get<User>(this.config.apiUrl+"/me",{'headers':httpOptions});
    }
    verify_token(){
        let httpOptions = this.config.httpOptions;
        httpOptions =  httpOptions.append('mbn-access-token',this.getToken());
        return this.httpClient.get<{success:boolean,message:string}>(this.config.apiUrl+"/verify_token/",{'headers':httpOptions});
    }
    update_profile(data){
        let httpOptions = this.config.httpOptions;
        httpOptions =  httpOptions.append('mbn-access-token',this.getToken());
        return this.httpClient.put<{  user:User,success:boolean,message:string}>(this.config.apiUrl+"/me/update",data,{'headers':httpOptions});
    }
    update_fcm_token(data){
        console.log("update_fcm_token: ", data);
        let httpOptions = this.config.httpOptions;
        httpOptions =  httpOptions.append('mbn-access-token',this.getToken());
        return this.httpClient.put<{  user:User,success:boolean,message:string}>(this.config.apiUrl+"/me/updateFCMToken",data,{'headers':httpOptions});
    }
    update_password(data){
        let httpOptions = this.config.httpOptions;
        httpOptions =  httpOptions.append('mbn-access-token',this.getToken());
        return this.httpClient.put<{  user:User,success:boolean,message:string}>(this.config.apiUrl+"/me/update-password",data,{'headers':httpOptions});
    }
    forgot_password(data,step){
        let httpOptions = this.config.httpOptions;
        return this.httpClient.post<any>(this.config.apiUrl+"/forgot-password/"+step,data,{'headers':httpOptions});
    }

    logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('auth_user_id');
        localStorage.removeItem('game_id');
        localStorage.removeItem('gameboard_view');
        localStorage.removeItem("button_pos");
        localStorage.removeItem("button_on");
        localStorage.removeItem("fcm_token");
      
        localStorage.removeItem('chip_selected');
        localStorage.removeItem('last_play_id');
        localStorage.removeItem('total_last_passline');
        localStorage.removeItem('max_pass_line_bets');
        this.router.navigate(['/login']);
    }
}