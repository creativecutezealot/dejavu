import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { GameboardService } from 'src/app/gameboard/gameboard.service';
import { AppService } from 'src/app/app.service';
import { Games } from 'src/app/models/lobby/games.model';
import { PopupoverSelectService } from '../popupover-select/popupover-select.service';
import { PopupoverSelect } from 'src/app/models/popupover-select.model';
import { Subscription } from 'rxjs';
import { PropBetsService } from './prop-bets.service';
import { PopupoverTextfieldService } from '../popupover-textfield/popupover-textfield.service';
import { PopupoverConfirmationService } from '../popupover-confirmation/popupover-confirmation.service';
import { GameTable } from 'src/app/models/gameboard/game_table.model';
import { Alertbox } from 'src/app/models/alertbox.model';
import { AlertboxService } from '../alertbox/alertbox.service';
import { PopupaccordionSelectService } from '../popupaccordion-select/popupaccordion-select.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user.model';
import { GroupsService } from '../groups/groups.service';

@Component({
  selector: 'app-prop-bets',
  templateUrl: './prop-bets.component.html',
  styleUrls: ['./prop-bets.component.css']
})
export class PropBetsComponent implements OnInit, OnDestroy {
  @Output('closed') closed = new EventEmitter<boolean>();
  @Output('back') back = new EventEmitter<boolean>();
  @Input('selectedGame') selectedGame: Games;

  alertbox: Alertbox = new Alertbox();

  is_freestyle: boolean = false;
  is_send_to_friend: boolean = true;
  is_will_result: boolean = false;
  is_with_timeframe: boolean = false;
  is_send_all_watching: boolean = false;
  is_proposed_odds: boolean = false;
  is_auto_renew: boolean = false;
  is_not: boolean = false;
  is_max_takers: boolean = false;
  animateClass: string = "slideInRight";

  _selected_player_team;
  _selected_will_result_in;
  _selected_with_timeframe;
  _selected_odds;
  _select_send_to;
  _bet_amount = 100;
  _max_takers = 1;

  _i_bet = 1;
  _to_win = 1;
  _event_content = "";
  _select_judge;

  player_team_options = [];

  will_result_in_options = [];
  will_result_in_options_temp = [];
  with_timeframe_options = [];
  odds_options = [];
  select_send_to_options = [];
  select_judge_options = [];

  popupOverSelectServiceSubscription = new Subscription();
  popupAccordionSelectServiceSubscription = new Subscription();
  popupOverConfirmationSubscription = new Subscription();
  gameTable: GameTable;
  gameboardStatusSubscription: Subscription;
  selectedGameSubscription: Subscription;
  batters: any;
  awayBatters: any;
  homeBatters: any;
  currentBatter: any;

  user: User;

  constructor(private popupOverSelectService: PopupoverSelectService,
    private popupOverTextfieldService: PopupoverTextfieldService,
    private popupOverConfirmation: PopupoverConfirmationService,
    private popupAccordionSelectService: PopupaccordionSelectService,
    private gameboardService: GameboardService,
    private propBetsService: PropBetsService,
    private alertboxService: AlertboxService,
    private authService: AuthService,
    private groupsService: GroupsService,) {

    this.popupAccordionSelectServiceSubscription = this.popupAccordionSelectService.dataSubject.subscribe(result => {
      this._selected_with_timeframe = null;
      if (result.event == "select_play_team" && result.status == false) {
        if (result.selected_item) {
          console.log("selected_item: ", result.selected_item);
          this._selected_player_team = result.selected_item;
          if (result.selected_item.key === "next_batter" || result.selected_item.key === "choose_batter") {
            this.is_will_result = true;
            this.is_with_timeframe = true;
            let team_results_index = this.will_result_in_options_temp.findIndex(option => option.key === "team_results");
            this.will_result_in_options = this.will_result_in_options_temp.filter((option, index) => index < team_results_index);
          } else {
            this.is_will_result = true;
            this.is_with_timeframe = false;
            let team_results_index = this.will_result_in_options_temp.findIndex(option => option.key === "team_results");
            if (result.selected_item.key === "any_batter_this_half_inning") {
              this.will_result_in_options = this.will_result_in_options_temp.filter((option, index) => index < team_results_index);
              let data = {
                key: "the_upcomming_inning",
                value: "The Upcoming Inning",
                itemObject: null,
                is_separator: false
              }
              this._selected_with_timeframe = data;
            } else {
              this._selected_will_result_in = null;
              this.will_result_in_options = this.will_result_in_options_temp.filter((option, index) => index >= team_results_index);
            }
          }
        }
      }
      if (result.event == "select_will_result" && result.status == false) {
        if (result.selected_item) {
          this._selected_will_result_in = result.selected_item;
          if (this._selected_player_team.key === "team_up_bat" || this._selected_player_team.key === "team_in_field") {
            if (result.selected_item.value.includes("Win The") || result.selected_item.value.includes("Win by") || result.selected_item.value.includes("Combine with")) {
              let data = {
                key: "this_game",
                value: "This Game",
                itemObject: null,
                is_separator: false
              }
              this._selected_with_timeframe = data;
            } else if (result.selected_item.value.includes("Score")) {
              let data = {
                key: "this_inning",
                value: "This Inning",
                itemObject: null,
                is_separator: false
              }
              this._selected_with_timeframe = data;
            }
          }
        }
      }
    });

    this.popupOverSelectServiceSubscription = this.popupOverSelectService.dataSubject.subscribe(result => {
      if (result.event == "select_timeframe" && result.status == false) {
        if (result.selected_item) {
          this._selected_with_timeframe = result.selected_item;
        }
      }
      if (result.event == "select_proposed_bets" && result.status == false) {
        if (result.selected_item) {
          this._selected_odds = result.selected_item;
        }
      }

      if (result.event == "select_send_to" && result.status == false) {
        if (result.selected_item) {
          this._select_send_to = result.selected_item.itemObject;
          if (this._select_send_to.user_friend_id) {
            this.select_judge_options = this.select_send_to_options.filter(item => item.itemObject.hasOwnProperty('user_friend_id'));
          } else {
            this.groupsService.list_members(this._select_send_to.group_id, "").subscribe(result => {
              this.select_judge_options = result.data.map(item => new PopupoverSelect(item.users._id, item.users.first_name + " " + item.users.last_name, false, this._select_send_to));
            });
          }
          const found = this.select_judge_options.some(item => item.key === this.user._id);
          if (!found) {
            this.select_judge_options.push(new PopupoverSelect(this.user._id, this.user.first_name + " " + this.user.last_name, false, this._select_send_to));
          }
        }
      }

      if (result.event == "select_judge" && result.status == false) {
        if (result.selected_item) {
          this._select_judge = result.selected_item;
          console.log(result.selected_item);
        }
      }
    });

    this.popupOverTextfieldService.dataSubject.subscribe(result => {
      if (result.event == "bet_amount") {
        this._bet_amount = result.entered_value;
      }
      if (result.event == "max_takers") {
        this._max_takers = result.entered_value;
      }
      if (result.event == "i_bet") {
        this._i_bet = result.entered_value;
      }
      if (result.event == "to_win") {
        this._to_win = result.entered_value;
      }
    });

    this.popupOverConfirmationSubscription = this.popupOverConfirmation.dataSubject.subscribe(result => {
      if (result.event == "prop_submit") {
        console.log('popupOverConfirmation: ', result);
        if (result.response) {
          this.onClose()
          if (this.is_freestyle) {
            let data = {
              is_freestyle: true,
              game_id: this.selectedGame.GameID,
              inning: this.selectedGame.Inning,
              inningHalf: this.selectedGame.InningHalf,
              homeTeamScore: this.selectedGame.HomeTeamRuns,
              awayTeamScore: this.selectedGame.AwayTeamRuns,
              currentHitter: this.selectedGame.CurrentHitter,
              receiver_id: this.is_send_to_friend === true ? this._select_send_to.user_friend_id : this._select_send_to.group_id,
              bet_amount: this._i_bet,
              to_win: this._to_win,
              event: this._event_content,
              judge: this._select_judge.key,
              max_takers: this._max_takers,
              status: 0,
              to_friend: this.is_send_to_friend,
              to_groups: !this.is_send_to_friend
            };
            gameboardService.submitPropBets(data);
          } else {
            let data = {
              is_freestyle: false,
              game_id: this.selectedGame.GameID,
              inning: this.selectedGame.Inning,
              inningHalf: this.selectedGame.InningHalf,
              homeTeamScore: this.selectedGame.HomeTeamRuns,
              awayTeamScore: this.selectedGame.AwayTeamRuns,
              currentHitter: this.selectedGame.CurrentHitter,
              receiver_id: this.is_send_to_friend === true ? this._select_send_to.user_friend_id : this._select_send_to.group_id,
              player_team_options: { "key": this._selected_player_team.key, "value": this._selected_player_team.value },
              will_result_in: this._selected_will_result_in.value,
              with_timeframe: this._selected_with_timeframe.value,
              proposed_odds: this._selected_odds.value,
              bet_amount: this._bet_amount,
              max_takers: this._max_takers,
              status: 0,
              all_watching_game: this.is_send_all_watching,
              to_friend: this.is_send_to_friend,
              to_groups: !this.is_send_to_friend
            };
            gameboardService.submitPropBets(data);
          }
        }
      }
    })

    this.gameboardService.gameTableSubject.subscribe((data) => {
      this.gameTable = data;
      console.log("gameTable")
      console.log(this.gameTable)
    });
  }
  ngOnDestroy() {
    this.popupOverSelectServiceSubscription.unsubscribe();
    this.popupAccordionSelectServiceSubscription.unsubscribe();
    this.popupOverConfirmationSubscription.unsubscribe();
  }

  ngOnInit() {
    console.log(localStorage.game_id)

    this.authService.me().subscribe((data) => {
      this.user = data;
    })

    this.getBatters(batters => {
      this.propBetsService.getAllOptionsBySection("player_team_options").subscribe(result => {
        result.forEach(item => {
          switch (item.key) {
            case "next_batter":
              this.player_team_options.push(new PopupoverSelect(item.key, item.name, item.is_separator));
              let batter = this.getNextBatterName(this.selectedGame);
              if (batter === null || batter === undefined) return;
              this.player_team_options.push(new PopupoverSelect(item.key, batter, false));
              break;
            case "choose_batter":
              this.player_team_options.push(new PopupoverSelect(item.key, item.name, item.is_separator));
              let nextBatters = this.getNextBattersName(this.selectedGame);
              if (nextBatters === null || nextBatters === undefined) return;
              nextBatters.map(batter => {
                this.player_team_options.push(new PopupoverSelect(item.key, batter, false));
              });
              break;
            case "any_batter_this_half_inning":
              this.player_team_options.push(new PopupoverSelect(item.key, item.name, item.is_separator));
              let batters = this.getBattersName(this.selectedGame);
              if (batters === null || batters === undefined) return;
              batters.map(batter => {
                this.player_team_options.push(new PopupoverSelect(item.key, batter, false));
              });
              break;
            case "team_up_bat":
              this.player_team_options.push(new PopupoverSelect(item.key, item.name, item.is_separator));
              this.player_team_options.push(new PopupoverSelect(item.key, this.selectedGame.HomeTeam, false));
              this.player_team_options.push(new PopupoverSelect(item.key, this.selectedGame.AwayTeam, false));
              // this.player_team_options.push(new PopupoverSelect(item.key, item.name, false));
              break;
            case "team_in_field":
              this.player_team_options.push(new PopupoverSelect(item.key, item.name, item.is_separator));
              // this.player_team_options.push(new PopupoverSelect(item.key, item.name, false));
              this.player_team_options.push(new PopupoverSelect(item.key, this.selectedGame.HomeTeam, false));
              this.player_team_options.push(new PopupoverSelect(item.key, this.selectedGame.AwayTeam, false));
              break;
          }
        });
      });
    });

    this.propBetsService.getAllOptionsBySection("will_result_in_options").subscribe(result => {
      this.will_result_in_options = result.map(item => new PopupoverSelect(item.key, item.name, item.is_separator));
      this.will_result_in_options_temp = this.will_result_in_options;
    });

    this.propBetsService.getAllOptionsBySection("timeframe").subscribe(result => {
      this.with_timeframe_options = result.map(item => new PopupoverSelect(item.key, item.name, item.is_separator));
    });

    this.propBetsService.getAllOptionsBySection("proposed_bets").subscribe(result => {
      this.odds_options = result.map(item => new PopupoverSelect(item.key, item.name, item.is_separator));
    });

    this.propBetsService.getAllOptionsTo().subscribe(result => {
      // this.select_send_to_options.push(new PopupoverSelect("", "Friends", true));
      let friends = result.friends.data.map(item => new PopupoverSelect(item.users._id, item.users.first_name + " " + item.users.last_name, false, item));
      // this.select_send_to_options.push(new PopupoverSelect("", "Groups", true));
      let groups = result.groups.data.map(item => new PopupoverSelect(item.groups._id, item.groups.name, false, item));
      this.select_send_to_options = [...friends, ...groups];
    });

  }

  onBack() {
    console.log(this.selectedGame)
    this.animateClass = "slideOutRight";
    this.back.next(true);
  }

  onClose() {
    console.log(this.selectedGame)
    this.animateClass = "slideOutRight";
    this.closed.next(true);
  }

  onChangeSendToFriend(val) {
    this._select_send_to = null;
    this._select_judge = null;
    this.select_judge_options = [];
    this.is_send_to_friend = val;
  }

  onChangeSendAllWatching(val) {
    this.is_send_all_watching = val;
  }

  onChangeProposedOdds(val) {
    this.is_proposed_odds = val;
  }

  onChangeFreestyle(val) {
    this.is_freestyle = val;
  }

  onSubmitPropBets() {
    var my_points = this._bet_amount;
    var your_points = 0;
    if (this.is_freestyle) {
      if (this._event_content === "" || !this._select_send_to || !this._select_judge) {
        this.alertbox.title = "Error";
        this.alertbox.message = "Please fill in all required fields";
        this.alertbox.status = true;
        this.alertboxService.alertbox.next(this.alertbox);
        return;
      }
      var message = "I bet my " + this._i_bet + " vs your " + this._to_win + " that " + this._event_content;
      const send_to = this._select_send_to.users ? this._select_send_to.users.first_name + " " + this._select_send_to.users.last_name : this._select_send_to.groups.name;
      const judge = this._select_judge.value;
      message += ` This will be sent to ${send_to}.`;
      message += ` This ${judge} will be judge.`
      this.popupOverConfirmation.dataSubject.next({ status: true, message: message, event: "prop_submit" });
    } else {
      if (!this._selected_player_team || !this._selected_will_result_in || !this._selected_with_timeframe || !this._selected_odds || !this._select_send_to) {
        this.alertbox.title = "Error";
        this.alertbox.message = "Please fill in all required fields";
        this.alertbox.status = true;
        this.alertboxService.alertbox.next(this.alertbox);
        return;
      }
      if (this._selected_odds.value === "Even") {
        your_points = this._bet_amount;
      } else if (parseInt(this._selected_odds.value) > 0) {
        your_points = Math.floor((parseInt(this._selected_odds.value) / 100) * this._bet_amount);
      } else {
        your_points = Math.floor((100 / (parseInt(this._selected_odds.value) * -1)) * this._bet_amount);
      }
      var message = "I bet my " + my_points + " vs your " + your_points + " that " + this._selected_player_team.value + " will " + this._selected_will_result_in.value + ", " + this._selected_with_timeframe.value + ".";

      if (this._max_takers > 1) {
        message += " The first " + this._max_takers + " takers will be accepted.";
      }
      const send_to = this._select_send_to.users ? this._select_send_to.users.first_name + " " + this._select_send_to.users.last_name : this._select_send_to.groups.name;
      message += ` This will be sent to ${send_to}`;
      this.popupOverConfirmation.dataSubject.next({ status: true, message: message, event: "prop_submit" });
    }
  }

  onSelectOptions(section: string) {
    switch (section) {
      case "select_play_team":
        console.log(this.player_team_options)
        console.log(this.selectedGame)
        this.popupAccordionSelectService.dataSubject.next({ status: true, event: section, data: this.player_team_options });
        break;
      case "select_will_result":
        if (!this.is_will_result) return;
        this.popupAccordionSelectService.dataSubject.next({ status: true, event: section, data: this.will_result_in_options });
        break;
      case "select_timeframe":
        if (!this.is_with_timeframe) return;
        this.popupOverSelectService.dataSubject.next({ status: true, event: section, data: this.with_timeframe_options });
        break;
      case "select_proposed_bets":
        this.popupOverSelectService.dataSubject.next({ status: true, event: section, data: this.odds_options });
        break;
      case "bet_amount":
        this.popupOverTextfieldService.dataSubject.next({ status: true, event: section, entered_value: this._bet_amount });
        break;
      case "select_send_to":
        let filtered = [];
        if (this.is_send_to_friend) {
          filtered = this.select_send_to_options.filter(option => option.itemObject.hasOwnProperty('user_friend_id'));
        } else {
          filtered = this.select_send_to_options.filter(option => option.itemObject.hasOwnProperty('group_id'));
        }
        this.popupOverSelectService.dataSubject.next({ status: true, event: section, data: filtered });
        break;
      case "max_takers":
        if (!this.is_max_takers) return;
        this.popupOverTextfieldService.dataSubject.next({ status: true, event: section, entered_value: this._max_takers });
        break;
      case "i_bet":
        this.popupOverTextfieldService.dataSubject.next({ status: true, event: section, entered_value: this._i_bet });
        break;
      case "to_win":
        this.popupOverTextfieldService.dataSubject.next({ status: true, event: section, entered_value: this._to_win });
        break;
      case "select_judge":
        this.popupOverSelectService.dataSubject.next({ status: true, event: section, data: this.select_judge_options });
        break;
    }
  }

  getBatters(callback) {
    this.propBetsService.getBatters(localStorage.game_id).subscribe(result => {
      // console.log("BATTERS")
      console.log(result.data)
      this.batters = result.data;
      callback(this.batters);
      // this.awayBatters = this.batters.filter(x => x.Player.Team == this.awayTeam.Key)
      // this.homeBatters = this.batters.filter(x => x.Player.Team == this.homeTeam.Key)
    })
  }

  getNextBatterName(selectedGame: Games) {
    if (selectedGame && selectedGame.CurrentHitter) {
      let index = this.batters.findIndex(batter => batter.Player.DraftKingsName === selectedGame.CurrentHitter);
      if (index >= 0 && index < this.batters.length - 1) {
        let nextBatter = this.batters[index + 1];
        return nextBatter.Player.DraftKingsName;
      }
      return null;
    }
  }

  getNextBattersName(selectedGame: Games) {
    if (selectedGame && selectedGame.CurrentHitter) {
      let index = this.batters.findIndex(batter => batter.Player.DraftKingsName === selectedGame.CurrentHitter);
      if (index >= 0 && index < this.batters.length - 1) {
        let nextBatters = this.batters.slice(index + 1);
        return nextBatters.map(batter => batter.Player.DraftKingsName);
      }
      return null;
    }

  }

  getBattersName(selectedGame: Games) {
    return this.batters.map(batter => batter.Player.DraftKingsName);
  }
}
