import {Component, Injectable, Inject} from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import {AuthService} from './auth/auth.service';
import {NgSpinKitModule} from 'ng-spin-kit';
import {USER} from './providers/providers';
import {Observable} from 'rxjs/Rx';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css']})

@Injectable()
@AutoUnsubscribe([])
export class AppComponent {

  // Sets initial value to true to show loading spinner on first load
  private loading = true;
  public sitetitle = 'Nigeria Scrabble Federation Games';
  model : any = {};
  private formloading = false;
  error = '';

  constructor(private router : Router, @Inject(USER)public user, private authbackend : AuthService) {
    router
      .events
      .subscribe((event : RouterEvent) => {
        this.navigationInterceptor(event);
      });
    this.getUserData();
  }

  // Shows and hides the loading spinner during RouterEvent changes
  private navigationInterceptor(event : RouterEvent) : void {
    if(event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in
    // case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }

  private getUserData() {
    this.formloading = false;
    if (!this.loggedIn()) {
      console.log('No current user id found!');
      return false;
    }
    // get current user details
    const user = this
      .authbackend
      .getCurrentUser();
    user.subscribe(response => {
      this.user = response;
      console.log(response);
      if (!this.user) {
        console.log('Could not get user info');
        this.logout();
      }
    }, err => {
      this.error = 'No saved credentials';
      this.logout();
    });
  }

  public loggedIn() {
    return this
      .authbackend
      .loggedIn();

  }

  private logout() {
    this.formloading = false;
    this
      .authbackend
      .logout();
  }

  private login() {
    this.formloading = true;
    const login = this
      .authbackend
      .login(this.model.username, this.model.password);
    login.subscribe(response => {
      console.log('gotcha..', response);
      this.user = response;
    }, err => {
      console.log(err);
      this.error = 'Login is incorrect!';
      this.formloading = false;
    }, () => this.getUserData);
  }

}
