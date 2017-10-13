import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {Http, URLSearchParams, Headers, RequestOptions, Response} from '@angular/http';
import {BASEURL, AUTHAPI, USER, REQUESTARGS} from '../providers/providers';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {WpApiUsers, WpApiCustom} from 'wp-api-angular';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import * as _ from 'underscore';

@Injectable()
@AutoUnsubscribe([])
export class AuthService {
  private api = '';
  private authurl = '';
  public token : string;
  private user_info : any = [];
  localStorage : CoolLocalStorage;
  sessionStorage : CoolLocalStorage;
  jwtHelper : JwtHelper = new JwtHelper();

  constructor(private wpApiUsers : WpApiUsers, private wpApiCustom : WpApiCustom, @Inject(Http)public http : Http, @Inject(BASEURL)private baseurl, @Inject(AUTHAPI)private authapi, localStorage : CoolLocalStorage, sessionStorage : CoolLocalStorage, @Inject(USER)private user, @Inject(REQUESTARGS)private options) {
    this.localStorage = localStorage;
    this.sessionStorage = sessionStorage;
    this.authurl = this.baseurl + this.authapi;
    this.token = this._getUserToken() || null;
    this.user = user;
  }

  private _getLoggedInUserDetails() {
    this._getUserToken();
    const options : any = [];
    options.headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Bearer ' + this.token
    };
    const search = new URLSearchParams();
    search.append('context', 'view');
    search.append('context', 'edit');
    options.search = search;
    options.withCredentials = true;
    const user = this
      .wpApiUsers
      .me(options);
    return user;
    // return user.map((response : Response) => response.json());
  }

  public loggedIn() : boolean {return tokenNotExpired();}

  public login(username : string, password : string) : Observable < any > {

    const options: any = [];

    const posted = {
      'username': username,
      'password': password
    };
    options.headers = {
      // 'Content-Type': 'application/x-www-form-urlencoded'
      'Content-Type': 'application/json;charset=UTF-8'
    };

    options.url = this.authurl + 'token';
    const auth = this
      .wpApiCustom
      .httpPost(options.url, posted, options);

    return auth.map((response : Response) => {
      // login successful if there's a jwt token in the response
      const token = response.json() && response
        .json()
        .token;
      if (token) {
        // set token property
        this.token = token;
        this
          .localStorage
          .setItem('token', this.token);
        // return true;
      } else {
        // return false to indicate failed login
        return false;
      }
    }).concatMap((token) => {
      const currentUser = this._getLoggedInUserDetails();
      return currentUser.map(response => {
        this.user_info = response.json();
        // console.log('this.user_info .....', this.user_info); return this.user_info;
      });
    }).concatMap((user) => {
      const store = this.setCurrentUser(this.user_info);
      return store
        .map(res => {
        return res;
      })
        .catch((error : any) => Observable.throw(error.json().error || 'Server error'));
    });
  }

  public logout() : void {
    // clear token remove user from local storage to log user out
    this.token = null;
    this
      .localStorage
      .removeItem('token');
    this
      .localStorage
      .removeItem('currentUser');
  }

  public setCurrentUser(data) : Observable < any > {
    console.log('setting user in local storage', data.name);
    const user = {
      id: data.id,
      username: data.username || null,
      name: data.name,
      email: data.email,
      custom_avatar: data.custom_avatar || null,
      is_admin: data
        .roles
        .includes('administrator')
        ? true
        : false || false,
      first_name: data.first_name || data.name,
      last_name: data.last_name || null,
      avatar_urls: data.avatar_urls || null,
      registered_date: new Date(data.registered_date) || null,
      slug: data.slug || null,
      games_liked: data.game_likes
    };
    this
      .localStorage
      .setObject('currentUser', user);
    return Observable
      .of(user)
      .map(resp => {
        const userdata = resp;
        return userdata;
      });
  }

  public getCurrentUser(detail?: string) : any {
    // const user = this   .localStorage   .getObject('currentUser');
    const user = this
      .localStorage
      .getObject('currentUser');
    return Observable
      .of(user)
      .map(resp => {
        let data = user;
        if (detail) {
          data = user[detail];
        }
        return data;
      })
      .catch((error : any) => Observable.throw(error + ' Error getting User'));
  }

  private useJwtHelper() {
    const token = localStorage.getItem('token');
    console.log(this.jwtHelper.decodeToken(token), this.jwtHelper.getTokenExpirationDate(token), this.jwtHelper.isTokenExpired(token));
  }

  private _getUserToken() : string {
    const u = this
      .localStorage
      .getItem('token');
    return u;
    // if (u)   return u['token']; return null;
  }

  private _extractData(res : Response) {
    const body = res.json();
    return body || [];
  }

  public updateLikes(gameid) {
    this._getUserToken();
    let userid;
    const id = this.getCurrentUser('id');
    id.subscribe(response => userid = response, err => {
      console.log(err);
      return err;
    });
    // console.log(`userid is ${userid}`);
    const options : any = [];
    options.body = {
      'game_likes': `${gameid}`
    };
    options.headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': 'Bearer ' + this.token
    };
    options.withCredentials = true;
    const update = this
      .wpApiUsers
      .update(userid, options.body, options);
    return update
      .debounceTime(500)
      .map(res => {
        res = res.json();
        // console.log('user ', res);
        return res;
      })
      .catch((error : any) => Observable.throw(error.json().error || 'Server error'));
  }

}
