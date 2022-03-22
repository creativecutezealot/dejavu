import { User } from '../user.model';
import { GameTable } from './game_table.model';

export class Bets{
    public _id: string;
    public user: User;
    public game_table: GameTable;
    public button_pos: string;
    public place: string;
    public amount: number;
    public status: number;
    public win: boolean;
    public isOdds: boolean;
    public innings: number;
    public last_selected_chip: number;
    public button_on:boolean;
    public created_at: Date;
    public updated_at: Date;
}