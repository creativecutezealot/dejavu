import { User } from '../user.model';
import { Games } from '../lobby/games.model';

export class GameTable{
    public _id:string;
    public user: User;
    public games: Games;
    public status: number; //0 in progress 1 completed
    public max_pass_line_bets:number;
    public total_last_passline:number;
    public total_win:number;
    public total_lose:number;
    public total_bets:number;
    public created_at: Date;
    public updated_at: Date;
}