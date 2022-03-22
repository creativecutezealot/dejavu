import { NgModule } from '@angular/core';
import { GameboardComponent } from './gameboard.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GameboardRoutingModule } from './gameboard-routing.module';
import { BoardComponent } from './board/board.component';
import { BetsFilterPipe } from '../shared/pipes/betsfilter.pipe';
import { SignupChipsComponent } from './signup-chips/signup-chips.component';
import { SharedModule } from '../shared/shared.module';
import { GameEndComponent } from './game-end/game-end.component';

@NgModule({
    declarations: [
        GameboardComponent,
        BoardComponent,
        BetsFilterPipe,
        SignupChipsComponent,
        GameEndComponent,

    ],
    imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        GameboardRoutingModule
    ]
})
export class GameboardModule { }