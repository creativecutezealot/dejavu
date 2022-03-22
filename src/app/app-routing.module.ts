import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';
import { MobileonlyComponent } from './mobileonly/mobileonly.component';

const routes: Routes = [
  { path: '', loadChildren: './account/login/login.module#LoginModule' },
  { path: 'login', loadChildren: './account/login/login.module#LoginModule' },
  { path: 'mobileonly', component: MobileonlyComponent },
  //{path:'lobby',canActivate:[AuthGuard],loadChildren:'./lobby/lobby.module#LobbyModule'},
  //{path:'gameboard',canActivate:[AuthGuard],loadChildren:'./gameboard/gameboard.module#GameboardModule'},
  //{path:'gameboard-phaser',canActivate:[AuthGuard],loadChildren:'./gameboard-phaser/gameboard-phaser.module#GameboardPhaserModule'},
  { path: 'lobby', canActivate: [AuthGuardService], loadChildren: './lobby/lobby.module#LobbyModule' },
  { path: 'gameboard', canActivate: [AuthGuardService], loadChildren: './gameboard/gameboard.module#GameboardModule' },
  //{path:'gameboard-phaser',canActivate:[AuthGuardService],loadChildren:'./gameboard-phaser/gameboard-phaser.module#GameboardPhaserModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
