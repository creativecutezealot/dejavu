import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ExternalPageService{
    
    
    constructor(private httpclient:HttpClient){
        
    }

    load(url:string){
        return this.httpclient.get(url);
    }
}