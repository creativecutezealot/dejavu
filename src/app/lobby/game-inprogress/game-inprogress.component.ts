import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Games } from 'src/app/models/lobby/games.model';
import { GameboardService } from '../../gameboard/gameboard.service';
import { GameResult } from 'src/app/models/lobby/game-result.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AlertboxService } from 'src/app/shared/alertbox/alertbox.service';
import { Alertbox } from 'src/app/models/alertbox.model';

@Component({
  selector: 'app-game-inprogress',
  templateUrl: './game-inprogress.component.html',
  styleUrls: ['./game-inprogress.component.css']
})
export class GameInprogressComponent implements OnInit {

  @Input('blurClass') blurClass;
  games: Games[];
  total_result = 0;
  total_page = 0;
  page = 0;
  boxClass = "bounceInDown";
  onProgress: boolean = false;
  loaded = false;
  timezoneoffset = (new Date().getTimezoneOffset());
  isItemSelected = [];
  selectedID: string = "";
  selectedGames: string = "";
  alertbox = new Alertbox();
  constructor(private gameboardService: GameboardService, private alertboxService: AlertboxService) {


  }

  ngOnInit() {

    this.gameboardService.currentGame.subscribe((resp) => {
      // console.log(resp)
      this.isItemSelected = [];
      this.total_result = resp.total_result;
      this.total_page = resp.total_page;
      this.page = resp.page;
      this.games = resp.data;
      this.loaded = true;
      this.selectedID = "";
    });

  }

  onNavigate(action: string) {
    if (action == "next") {
      if (this.page < this.total_page) {
        this.page = this.page + 1;
        this.gameboardService.getGameData(this.page);
      }
    }

    if (action == "prev") {
      if (this.page > 1) {
        this.page = this.page - 1;
        this.gameboardService.getGameData(this.page);
      }
    }
  }

  onChooseGame(index, games, id, status) {

    if (status != "InProgress") {
      return false;
    }

    this.selectedID = id;
    this.selectedGames = games;

    for (var l = 0; l < this.isItemSelected.length; l++) {
      this.isItemSelected[l] = false;
    }

    this.isItemSelected[index] = true;


  }
  onSelectGame() {
    if (this.selectedID == "") {
      this.alertbox.message = "Please select a game first";
      this.alertbox.status = true;
      this.alertboxService.alertbox.next(this.alertbox);
    } else {
      localStorage.setItem("game_id", this.selectedID);
      localStorage.setItem("games", this.selectedGames);
      this.boxClass = "bounceOutUp";

      setTimeout(() => {
        this.gameboardService.createGame(this.selectedGames);
        this.gameboardService.gameboard.view = "in_game";
        localStorage.setItem("gameboard_view", this.gameboardService.gameboard.view);
        this.gameboardService.gameboardStatus.next(this.gameboardService.gameboard);
      }, 1000);
    }
  }


  onReload(event) {
    this.games = [];
    this.gameboardService.lastgamesimulatorid = "";
    this.gameboardService.getGameData();

  }

}
