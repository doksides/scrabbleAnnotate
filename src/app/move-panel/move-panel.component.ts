import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {UiPlaytabComponent} from '../ui-playtab/ui-playtab.component';
import {UiMovelistComponent} from '../ui-movelist/ui-movelist.component';
import {AuthService} from '../auth/auth.service';
import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';

import * as _ from 'underscore';

@Component({selector: 'app-move-panel', templateUrl: './move-panel.component.html', styleUrls: ['./move-panel.component.css']})
export class MovePanelComponent implements OnInit {
  @Input()gameinfo;
  @Input()currentmove;

  @ViewChild(UiPlaytabComponent)playtab : UiPlaytabComponent;
  @ViewChild(UiMovelistComponent)movelist : UiMovelistComponent;

  @Output()pagerchange : EventEmitter < number > = new EventEmitter < number > ();
  @Output()colorchange : EventEmitter < {} > = new EventEmitter < {} > ();

  // Pager vars
  public turns : number;
  public currentMove : number;
  public disabled = false;

  // alert
  alertType = 'info';
  notes = '';

  private likeBtnTitle = 'Click to like this game';

  constructor(private authbackend : AuthService) {}

  ngOnInit() {
    this._updateAlert();
    // console.log(this.gameinfo.turn);
  }

  public onPanelPaginationChanged(event : any) : void {
    this.currentMove = +event;
    // console.log('currentMove from pager ' + this.currentMove);
    this
      .pagerchange
      .emit(this.currentMove);
  }

  private _updateAlert() {
    this.alertType = 'info';
    this.notes = null;
    const cm = this.gameinfo.turn;
    if (cm.bonus === true) {
      this.alertType = 'warning';
      this.notes = `<i class="fa fa-bullseye fa-2x fa-pull-left" aria-hidden="true"></i> <strong>BINGO!</strong>`;
    }
    if (cm.event === 'chall+') {
      this.alertType = 'success';
      this.notes = `<i class="fa fa-check fa-2x  fa-pull-left " aria-hidden="true"></i> <strong>CHALLENGE Result:</strong> Valid play! `;
    }
    if (cm.event === 'chall-') {
      this.alertType = 'danger';
      this.notes = `<i class="fa fa-remove fa-2x fa-pull-left" aria-hidden="true"></i> <strong>CHALLENGE Result:</strong> Invalid play!`;
    }
  }

  public updateView() {
    this._updateAlert();
    this
      .movelist
      .buildMoveList();
    this
      .playtab
      .initTiles();
  }

  public onTileColorChange(e : any) : void {
    this
      .colorchange
      .emit(e);
  }

  /** Likes button display */
  public is_liked(data) : boolean {
    // get current logged in user id
    const userid = this
      .authbackend
      .getCurrentUser('id');
    if (this.loggedIn() && userid && data.likes_count > 0) {
      // has user already liked the game?
      const likes = data.liked_by;
      const liked = likes.includes('' + userid);
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
   * Handle like button click
   *
  */
  public likeBtnClick(id) {
    console.log(id);
  }

  public loggedIn() : boolean {
    return this
      .authbackend
      .loggedIn();
  }
}
