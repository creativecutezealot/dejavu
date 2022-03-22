import { Games } from './games.model';

export class GameResult{
    public total_result:number;
    public total_page:number;
    public page:number;
    public data: Games[];
    public type: string;
}