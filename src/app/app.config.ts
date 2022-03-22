import { environment } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
@Injectable()
export class AppConfig {
    public host: string = environment.host;
    public socketDebug: string = environment.socketDebug;
    public protocol: string = environment.protocol;
    public version: string = environment.version;
    public port: string = environment.port;
    public apiUrl: string = "";
    public socketUrl: string = "";
    public httpOptions = new HttpHeaders({
        'Content-Type': "application/json"
    });

    constructor() {
        this.socketDebug = environment.socketDebug;
        localStorage.setItem("debug", this.socketDebug);

        if (environment.production == true) {
            // this.apiUrl = this.protocol + "://" + this.host + "/" + this.version;
            // this.socketUrl = this.protocol + "://" + this.host;
            this.apiUrl = this.protocol + "://" + this.host + ":" + this.port + "/" + this.version;
            this.socketUrl = this.protocol + "://" + this.host + ":" + this.port;
        } else {
            if (this.port != "") {
                this.apiUrl = this.protocol + "://" + this.host + ":" + this.port + "/" + this.version
                this.socketUrl = this.protocol + "://" + this.host + ":" + this.port;
            } else {
                this.apiUrl = this.protocol + "://" + this.host + "/" + this.version;
                this.socketUrl = this.protocol + "://" + this.host + ":" + this.port
            }
        }
    }
}