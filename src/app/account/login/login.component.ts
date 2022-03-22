import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { App } from 'src/app/models/app.model';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AlertboxService } from 'src/app/shared/alertbox/alertbox.service';
import { Alertbox } from 'src/app/models/alertbox.model';
import { CreateAccountService } from './create-account/create-account.service';
import { AuthService } from 'src/app/auth/auth.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('logo', { static: false }) logo: ElementRef;

  dataForm: FormGroup;
  remember: boolean = false;
  app: App = new App();
  alertbox: Alertbox = new Alertbox();

  has_popup = false;
  show_forgot_password = false;
  init_page: boolean = false;
  username;
  password;
  constructor(private router: Router,
    private appService: AppService,
    private alertboxService: AlertboxService,
    private createAccountService: CreateAccountService,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document) {

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/lobby']);
    }
    this.app = this.appService.app;
    this.appService.appStatus.subscribe((app) => {
      this.app = app;
    });

    this.app.bgClass = 'loginbg';
    this.appService.appStatus.next(this.app);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.app.app_loading = true;
        this.appService.appStatus.next(this.app);

      }
      if (event instanceof NavigationEnd) {
        this.app.app_loading = false;
        this.appService.appStatus.next(this.app);
        this.init_page = true;
      }
    });

    document.body.classList.add("loginbg");
  }

  ngOnInit() {

    this.dataForm = new FormGroup({
      'email': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'remember': new FormControl(1),
    });
    this.alertboxService.alertbox.subscribe((alertbox) => {
      this.alertbox = alertbox;
    });
    this.createAccountService.is_active.subscribe((is_active) => {
      this.has_popup = is_active;
    });

    this.username = localStorage.getItem('username');
    this.password = localStorage.getItem('password');
    if (this.username && this.password) {
      this.dataForm.get('email').setValue(this.username);
      this.dataForm.get('password').setValue(this.password);
    }
    const chkremember = localStorage.getItem('remember');
    if (chkremember) {
      this.remember = true;
    }
  }
  ngOnDestroy() {
    document.body.classList.remove("loginbg")
  }

  onLogin() {
    if (String(this.dataForm.get('email').value).trim() == "") {
      this.alertbox.title = "Invalid";
      this.alertbox.message = "Please enter your username";
      this.alertbox.status = true;

      this.alertboxService.alertbox.next(this.alertbox);
      return false;
    }
    if (String(this.dataForm.get('password').value).trim() == "") {
      this.alertbox.title = "Invalid";
      this.alertbox.message = "Please enter your password";
      this.alertbox.status = true;
      this.alertboxService.alertbox.next(this.alertbox);
      return false;
    }

    this.app.app_loading = true;
    this.appService.appStatus.next(this.app);
    let loginData = {
      ...this.dataForm.value,
      fcm_token: localStorage.getItem("fcm_token"),
    }
    this.authService.loginUser(loginData).subscribe((resp) => {
      console.log(resp);
      this.app.app_loading = false;
      this.appService.appStatus.next(this.app);
      if (resp.success) {
        if (this.remember) {
          localStorage.setItem('username', this.dataForm.controls['email'].value);
          localStorage.setItem('password', this.dataForm.controls['password'].value);
          localStorage.setItem('remember', "1");
        } else {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
          localStorage.removeItem('remember');
        }
        this.authService.token = resp.token;
        localStorage.setItem('token', resp.token);
        localStorage.setItem('auth_user_id', resp.user._id);
        this.authService.user = resp.user;
        this.appService.appStatus.next(this.app);
        this.router.navigate(['/lobby']);
      } else {
        this.alertbox.message = resp.message;
        this.alertbox.status = true;
        this.alertboxService.alertbox.next(this.alertbox);
      }



    }, (error) => {
      console.log(error);
      alert(JSON.stringify(error));
      this.alertbox.title = "Server Error";
      this.alertbox.message = "Could not connect to server, please try again";
      this.alertbox.status = true;
      this.alertboxService.alertbox.next(this.alertbox);
      this.app.app_loading = false;
      this.appService.appStatus.next(this.app);
    });



  }

  onRemember(e) {
    this.remember = this.remember ? false : true;
  }

  onCreateAccount() {
    this.has_popup = true;
    this.createAccountService.is_active.next(this.has_popup);
  }

  onForgotPassword() {
    this.has_popup = true;
    this.show_forgot_password = true;
  }
  onCloaseForgotPassword() {
    this.has_popup = false;
    this.show_forgot_password = false;
  }


}
