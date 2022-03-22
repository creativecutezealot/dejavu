import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { GameboardService } from 'src/app/gameboard/gameboard.service';
import { AppService } from 'src/app/app.service';
import { Games } from 'src/app/models/lobby/games.model';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.css']
})

export class GameHistoryComponent implements OnInit {
  @Output('closed') closed = new EventEmitter<boolean>();
  animateClass:string = "slideInRight";
  page:number = 1;
  total_page:number =0;
  data:game_history[] = [];
  constructor(private gameboardService:GameboardService,private appService:AppService) { 
    this.gameboardService.getGameHistory(this.page);
    this.gameboardService.socket.on('game_response',resp=>{
      if(resp.type=="list_game_history"){
        this.data.push(...resp.data);
        console.log(resp.data)
       this.total_page = resp.total_page;
       this.page = resp.page;
      }//end
    });

    
  }

  ngOnInit() {
    const game_history_items  = document.getElementById("game_history_items");
    const game_history_items_c = document.getElementById("game_history_items_c");
    game_history_items.onscroll = (e)=>{
        const totalscrollable = (game_history_items_c.offsetHeight + 18) -  (game_history_items.offsetHeight-143);   
        const scroll = game_history_items.scrollTop / totalscrollable;

        if(scroll>=0.90){
          if(this.page<this.total_page){
            this.page++;
            this.gameboardService.getGameHistory(this.page);
          }
        }
    }
  }

  onClose(){
    this.animateClass = "slideOutRight";
    this.closed.next(true);
   
  }

}

export interface game_history{
  total_win:number;
  total_lose:number;
  games:Games;
  created_at:Date
}
