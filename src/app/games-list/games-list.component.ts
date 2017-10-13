import { identifierModuleUrl } from '@angular/compiler';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import { GamesService } from '../services/games.service';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as _ from 'underscore';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css'],
  providers: [NgbPaginationConfig]
})
@AutoUnsubscribe([])
export class GamesListComponent implements OnChanges {
  @Input() gamedata;
  // @Output()likeBtnClicked = new EventEmitter < boolean > ();
  @Output() homepaginationchanged = new EventEmitter<number>();
  @Output() paginationbottomchanged = new EventEmitter<number>();

  public totalItems: number;
  public itemsPerPg: number;
  public currentPage: number;
  public noOfPgs: number;
  changeLog: string[] = [];
  public likeBtnTitle = 'Click to like this game';
  // public serverObs : any;
  public disableBtn = false;
  private userid: number;
  public showLikeAlert = false;
  private _success = new Subject<string>();

  alertMessage: string;
  alertType: string;

  constructor(
    private backend: GamesService,
    private authbackend: AuthService,
    config: NgbPaginationConfig
  ) {
    config.size = 'sm';
    config.boundaryLinks = true;
    config.directionLinks = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.gamedata) {
      this.gamedata.data = this.gamedata.data;
      this.totalItems = +this.gamedata.total;
      this.noOfPgs = +this.gamedata.totalpages;
      this.itemsPerPg = 10;
      this.currentPage = +this.gamedata.page;
      // this._gamedataArr = _.toArray(this.gamedata['data']);
      // console.log(this.currentPage);
    }
    this.userid = this.authbackend.getCurrentUser('id') || null;
  }

  /** Likes button display */
  public is_liked(gameid: number): boolean {
    if (this.loggedIn()) {
      let userid;
      const id = this.authbackend.getCurrentUser('id');
      id.subscribe(
        response => (userid = response),
        err => {
          console.log(err);
        }
      );
      const gamedataArr = _.toArray(this.gamedata['data']);
      const data = _.findWhere(gamedataArr, { gameid: gameid });
      // console.log(userid, data); has user already liked the game?
      let liked = false;
      if (data['liked_by'] && userid) {
        // console.log(gameid, userid, data['liked_by']);
        liked = data['liked_by'].includes(userid);
      }
      if (liked) {
        this.likeBtnTitle = 'Unlike this game?';
      } else {
        this.likeBtnTitle = 'Click to like this game';
      }
      return liked;
    }
    return false;
  }

  /**
   *
   * Handle like button click
   *
  **/

  public handleLikeBtnClick(gameid: number, btn: any) {
    this.disableBtn = true;
    console.clear();
    console.log('button game id clicked ' + gameid, btn.getAttribute('class'));
    const res = this.authbackend.updateLikes(gameid);
    res.subscribe(
      response => {
        this._alertLike(btn);
        this.authbackend.setCurrentUser(response);
      },
      error => {
        this._alertError(error);
        console.log(error);
      },
      () => this._getGameData(gameid)
    );
  }

  public loggedIn(): boolean {
    return this.authbackend.loggedIn();
  }

  private _alertLike(btn: any) {
    const className = 'glyphicon-heart-empty';
    const is_liked = new RegExp('(\\s|^)' + className + '(\\s|$)').test(
      btn.className
    );
    btn.classList.toggle('glyphicon-heart-empty', !is_liked);
    btn.classList.toggle('glyphicon-heart', is_liked);

    this.alertMessage = 'Game added to your favorites';
    this.alertType = 'success';
    if (!is_liked) {
      this.alertMessage = 'Game removed from your favorites';
      this.alertType = 'warning';
    }
    this.showLikeAlert = true;

    this._success.subscribe(message => (this.alertMessage = message));
    debounceTime
      .call(this._success, 5000)
      .subscribe(() => (this.alertMessage = null));
  }

  private _alertError(err) {
    this.alertMessage = 'Oops..we had a problem connecting to the server';
    this.alertType = 'error';
    this._success.subscribe(message => (this.alertMessage = message));
    debounceTime
      .call(this._success, 5000)
      .subscribe(() => (this.alertMessage = null));
  }

  private _getGameData(gameid): any {
    const pageno = this.currentPage || 1;
    // console.log(gameid);
    const obs = this.backend.loadGameData(`${pageno}`);
    obs.subscribe(
      response => (this.gamedata = response),
      error => console.log(error),
      () => this.is_liked(gameid)
    );
    this.disableBtn = false;
  }

  public onPageChanged(event: any): void {
    // current page number emitted from Ngb-Pagination component
    this.homepaginationchanged.emit(event);
    this.currentPage = event;
    console.log('top pagination: ' + this.currentPage);
  }

  public onPageChangedBottom(event: any): void {
    // current page number emitted from Ngb-Pagination component
    this.paginationbottomchanged.emit(event);
    this.currentPage = event;
    console.log('bottom pagination: ' + this.currentPage);
  }
}
