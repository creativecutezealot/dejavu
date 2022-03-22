import { Groups } from './groups.model';
import { User } from './user.model';

export class GroupsMembers{
    public _id:string;
    public user_id: string;
    public group_id: string;
    public status: boolean;
    public created_at:Date;
    public updated_at:Date;
    public users:User;
    public groups:Groups;
}