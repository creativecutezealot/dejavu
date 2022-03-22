import { GroupsMembers } from './groups-members.model';
import { UsersFriends } from './users_friends.model';

export class User{
    public _id: string;
    public first_name: string;
    public last_name: string;
    public display_name: string;
    public email: string;
    public level: number;
    public users_friends: UsersFriends;
    public groups_members: GroupsMembers[];
    public join_group_status:number;
    public is_owner:boolean;
}