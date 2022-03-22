import { User } from './user.model';

export class Groups{
    public _id:string;
    public user_id: string;
    public name: string;
    public created_at:Date;
    public updated_at:Date; 
    public users:User;

}