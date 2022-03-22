import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
    declarations:[
        LoginComponent,
        CreateAccountComponent,
        ForgotPasswordComponent
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        LoginRoutingModule
    ]
})
export class LoginModule{}