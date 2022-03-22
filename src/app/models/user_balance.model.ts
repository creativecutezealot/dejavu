import { User } from './user.model';

export class UserBalance{
    public _id:string;
    public user: User;
    public type: number;
    public description: string;
    public amount: number;
    public created_at:Date;
    public updated_at:Date;

}