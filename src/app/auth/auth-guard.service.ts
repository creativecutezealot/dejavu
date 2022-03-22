import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
@Injectable()
export class AuthGuardService implements CanActivate{    
    constructor(private router: Router,
        private authService: AuthService) { 

        }//end
    canActivate( route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot){
        const isAuthenticated = this.authService.isAuthenticated();
        if(isAuthenticated){
            return isAuthenticated;
        }//end
        this.router.navigate(["/login"]);
        return false;
    }//end
}