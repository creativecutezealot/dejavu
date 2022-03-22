import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AppConfig } from './app.config';
import { AuthGuardService } from '../app/auth/auth-guard.service';
import { AuthService } from '../app/auth/auth.service';
import { PreloaderComponent } from './shared/preloader/preloader.component';
import { AlertboxComponent } from './shared/alertbox/alertbox.component';
import { AlertboxService } from './shared/alertbox/alertbox.service';
import { CreateAccountService } from './account/login/create-account/create-account.service';
import { HttpClientModule } from '@angular/common/http';
import { LobbyService } from './lobby/lobby.service';
import { UserBalanceService } from './user-balance/user-balance.service';
import { GameboardService } from './gameboard/gameboard.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UserBalanceComponent } from './user-balance/user-balance.component';
import { SharedModule } from './shared/shared.module';
import { UsersService } from './users/users.service';
import { MobileonlyComponent } from './mobileonly/mobileonly.component';
import { ExternalPageService } from './shared/externalpage/externalpage.service';
import { GameEndService } from './gameboard/game-end/game-end.services';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    AlertboxComponent,
    UserBalanceComponent,
    MobileonlyComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    AuthGuardService,
    AppService,
    AuthService,
    AppConfig,
    AlertboxService,
    CreateAccountService,
    LobbyService,
    UserBalanceService,
    GameboardService,
    UsersService,
    ExternalPageService,
    GameEndService,
    BsDatepickerConfig,
    InAppPurchase2
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
