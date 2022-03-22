import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { User } from '../../../models/user.model';
@Injectable()
export class CreateAccountService{

    public is_active = new Subject<boolean>();
  
    constructor(private httpclient: HttpClient,private config: AppConfig){

    }

    submit(data){
        return this.httpclient.post<{success:boolean,message:string}>(this.config.apiUrl+"/auth/signup",data,{headers:this.config.httpOptions});
    } 

}