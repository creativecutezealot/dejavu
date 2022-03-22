import { NgModule } from '@angular/core';
import { LobbyComponent } from './lobby.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LobbyRoutingModule } from './lobby-routing.module';
import { MoneyComponent } from './money/money.component';
import { GameInprogressComponent } from './game-inprogress/game-inprogress.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        LobbyComponent,
        MoneyComponent,
        GameInprogressComponent,

    ],
    imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        LobbyRoutingModule
    ]
})
export class LobbyModule { }