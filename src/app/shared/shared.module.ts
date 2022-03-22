import { NgModule } from '@angular/core';
import { AdsComponent } from './ads/ads.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ScrollbarComponent } from './scrollbar/scrollbar.component';
import { ScoresComponent } from '../lobby/scores/scores.component';
import { UserRankComponent } from './user-rank/user-rank.component';
import { GameCurrencyFormatPipe } from './pipes/gameCurrencyFormat.pipe';
import { MainMenuComponent } from '../shared/main-menu/main-menu.component';
import { EditProfileComponent } from '../shared/account-settings/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../shared/account-settings/change-password/change-password.component';
import { HowToPlayComponent } from '../shared/how-to-play/how-to-play.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrdinalPipe } from './pipes/ordinal.pipe';
import { GameHistoryComponent } from './game-history/game-history.component';
import { AboutComponent } from './about/about.component';
import { ExternalpageComponent } from './externalpage/externalpage.component';
import { TermspageComponent } from './termspage/termspage.component';
import { TermsandconditionsComponent } from './termspage/termsandconditions/termsandconditions.component';
import { PrivacyComponent } from './termspage/privacy/privacy.component';
import { EulaComponent } from './termspage/eula/eula.component';
import { OpensourceComponent } from './termspage/opensource/opensource.component';
import { PropBetsComponent } from './prop-bets/prop-bets.component';
import { SwitchComponent } from './switch/switch.component';
import { PropBetsMenuComponent } from './prop-bets/prop-bets-menu/prop-bets-menu.component';
import { PopupoverSelectComponent } from './popupover-select/popupover-select.component';
import { PopupoverTextfieldComponent } from './popupover-textfield/popupover-textfield.component';
import { FriendsComponent } from './friends/friends.component';
import { FriendsMenuComponent } from './friends-menu/friends-menu.component';
import { PopupoverConfirmationComponent } from './popupover-confirmation/popupover-confirmation.component';
import { FriendsRequestComponent } from './friends-request/friends-request.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { GroupsMenuComponent } from './groups-menu/groups-menu.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupsCreateComponent } from './groups/groups-create/groups-create.component';
import { GroupsListComponent } from './groups/groups-list/groups-list.component';
import { GroupsMembersComponent } from './groups/groups-members/groups-members.component';
import { GroupsMembersInviteComponent } from './groups/groups-members-invite/groups-members-invite.component';
import { GroupsInviteComponent } from './groups-invite/groups-invite.component';
import { OddsRulesComponent } from '../lobby/odds-rules/odds-rules.component';
import { MyContestsComponent } from './my-contests/my-contests.component';
import { AddContestComponent } from './my-contests/add-contest/add-contest.component';
import { ContestInvitesComponent } from './my-contests/contest-invites/contest-invites.component';
import { ContestSingleComponent } from './my-contests/contest-single/contest-single.component';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ActivePropBetsComponent } from './prop-bets/active-prop-bets/active-prop-bets.component';
import { AvailablePropBetsComponent } from './prop-bets/available-prop-bets/available-prop-bets.component';
import { PropBetOutcomesComponent } from './prop-bets/prop-bet-outcomes/prop-bet-outcomes.component';
import { PropBetConfirmationComponent } from './prop-bets/prop-bet-confirmation/prop-bet-confirmation.component';
import { PopupaccordionSelectComponent } from './popupaccordion-select/popupaccordion-select.component';

@NgModule({
    declarations:[
        AdsComponent,
        ScrollbarComponent,
        ScoresComponent,
        UserRankComponent,
        GameCurrencyFormatPipe,
        OrdinalPipe,
        MainMenuComponent,
        EditProfileComponent,
        ChangePasswordComponent,
        HowToPlayComponent,
        GameHistoryComponent,
        AboutComponent,
        ExternalpageComponent,
        TermspageComponent,
        TermsandconditionsComponent,
        PrivacyComponent,
        EulaComponent,
        OpensourceComponent,
        PropBetsComponent,
        SwitchComponent,
        PropBetsMenuComponent,
        PopupoverSelectComponent,
        PopupoverTextfieldComponent,
        FriendsComponent,
        FriendsMenuComponent,
        PopupoverConfirmationComponent,
        FriendsRequestComponent,
        NotificationsComponent,
        GroupsMenuComponent,
        GroupsComponent,
        GroupsCreateComponent,
        GroupsListComponent,
        GroupsMembersComponent,
        GroupsMembersInviteComponent,
        GroupsInviteComponent,
        OddsRulesComponent,
        MyContestsComponent,
        AddContestComponent,
        ContestInvitesComponent,
        ContestSingleComponent,
        ActivePropBetsComponent,
        AvailablePropBetsComponent,
        PropBetOutcomesComponent,
        PropBetConfirmationComponent,
        PopupaccordionSelectComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
    ],
    exports:[
        GameCurrencyFormatPipe,
        OrdinalPipe,
        AdsComponent,
        ScrollbarComponent,
        ScoresComponent,
        UserRankComponent,
        MainMenuComponent,
        EditProfileComponent,
        ChangePasswordComponent,
        HowToPlayComponent,
        GameHistoryComponent,
        AboutComponent,
        ExternalpageComponent,
        TermsandconditionsComponent,
        EulaComponent,
        OpensourceComponent,
        PropBetsComponent,
        SwitchComponent,
        PropBetsMenuComponent,
        PopupoverSelectComponent,
        PopupoverTextfieldComponent,
        FriendsComponent,
        FriendsMenuComponent,
        PopupoverConfirmationComponent,
        FriendsRequestComponent,
        NotificationsComponent,
        GroupsMenuComponent,
        GroupsComponent,
        GroupsCreateComponent,
        GroupsInviteComponent,
        OddsRulesComponent,
        MyContestsComponent,
        AddContestComponent,
        ContestInvitesComponent,
        ContestSingleComponent,
        AvailablePropBetsComponent,
        ActivePropBetsComponent,
        PropBetOutcomesComponent,
        PropBetConfirmationComponent,
        PopupaccordionSelectComponent
    ],
})
export class SharedModule{ }