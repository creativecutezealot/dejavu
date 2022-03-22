import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameboardComponent } from './gameboard.component';

const loginRoutes: Routes = [
    { path: '', component: GameboardComponent }
]
@NgModule({
    imports: [
        RouterModule.forChild(loginRoutes)
    ],
    exports: [RouterModule]
})
export class GameboardRoutingModule { }