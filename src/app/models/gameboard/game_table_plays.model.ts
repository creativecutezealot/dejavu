import { Games } from '../lobby/games.model';
import { CheckUserWinner } from './check_user_winner.model';

export class GameTablePlays {
   public games: Games;
   public PlayID: number;
   public result: string;
   public button_on: boolean;
   public button_pos: string;
   public check_user_winner: CheckUserWinner;
   public user_lose: boolean;
   public inning: number;
   public inningHalf: string;
   public game_status: string;
   public runner: Array<any>;
   public created_at: Date;
   public updated_at: Date;
}