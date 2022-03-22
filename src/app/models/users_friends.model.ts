import { User } from './user.model';

export class UsersFriends{
    public _id: string;
    public status:boolean;
    public user_id: string;
    public user_friend_id: string;
    public user:User;

    public created_at: Date;
    public updated_at: Date;

    constructor(user_id?:string,user_friend_id?:string,status?:boolean){
        this.user_id = user_id;
        this.user_friend_id = user_friend_id;
        this.status = status;
    }
}