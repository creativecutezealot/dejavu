import { User } from '../models/user.model';
export class UserScores{
    public _id:string;
    public total:number;
    public user: User;
}