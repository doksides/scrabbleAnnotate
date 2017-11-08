import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Location,
  LocationChangeEvent,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { MoveBoardComponent } from '../move-board/move-board.component';
import { MoveNavComponent } from '../move-nav/move-nav.component';
import { MovePanelComponent } from '../move-panel/move-panel.component';
import * as _ from 'underscore';

@Component({
  selector: 'app-board-view',
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
  ],
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit {
  @Input() detail;
  @Input() moveno;
  location: Location;
  isLastMove = false;
  lastMoveNo = null;

  @ViewChild(MoveBoardComponent) moveboard: MoveBoardComponent;
  @ViewChild(MoveNavComponent) movenav: MoveNavComponent;
  @ViewChild(MovePanelComponent) movepanel: MovePanelComponent;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    location: Location
  ) {
    this.location = location;
    this.location.subscribe((event: LocationChangeEvent) => {
      this.LocChange(event);
    });
  }

  ngOnInit(): void {
    this.initGame();
  }

  initGame() {
    this.detail = this._route.snapshot.data['detail'];
    // console.log(this.detail);
    this.movenav.turns = this.detail.noofturns;
    this.movepanel.turns = this.detail.noofturns;
    const moveno = +this._route.snapshot.paramMap.get('moveno');
    // Show curr move no in pagination
    this.movepanel.currentMove = moveno;
    this.movenav.currentPage = moveno;
    this.detail.turn = this.detail.moves_json[moveno - 1];
    this.detail.currentmove = moveno;
    this._getPreviousMoves();
  }

  private _getPreviousMoves() {
    // Determine if we are on the last move
    if (
      this.detail.turn['event'] === 'rack+' ||
      this.detail.turn['event'] === 'time+'
    ) {
      this.isLastMove = true;
      this.lastMoveNo = this.detail.currentmove;
    }
    if (
      this.detail.turn['event'] === 'play' ||
      this.detail.currentmove !== this.lastMoveNo
    ) {
      this.isLastMove = false;
    }
    this.detail.isLastMove = this.isLastMove;

    this.detail.player1 = {};
    this.detail.player2 = {};
    const move_no = this.detail.currentmove - 1;
    // this.detail.current_player = this.detail.moves_json[move_no]['player'];
    this.detail.next_turn =
      this.detail.moves_json[this.detail.currentmove] || null;
    let t = _.findLastIndex(_.first(this.detail.moves_json, move_no), {
      player: 1
    });
    this.detail.player1.prev_turn = this.detail.moves_json[t];
    t = _.findLastIndex(_.first(this.detail.moves_json, move_no), {
      player: 2
    });
    this.detail.player2.prev_turn = this.detail.moves_json[t];
    if (this.detail.turn['event'] === 'chall+') {
      this.detail.turn['fullword'] = this.detail.moves_json[
        this.detail.currentmove - 2
      ]['fullword'];
    }
    // Get the scores at the end of the game. End of the game being when extra tiles
    // are added or when there is time penalty
    if (
      this.detail.turn['event'] === 'rack+' ||
      this.detail.turn['event'] === 'time+'
    ) {
      let m = _.findLastIndex(
        _.first(this.detail.moves_json, this.detail.currentmove),
        { player: 1 }
      );
      this.detail.player1.final_score = this.detail.moves_json[m]['totalscore'];
      m = _.findLastIndex(
        _.first(this.detail.moves_json, this.detail.currentmove),
        { player: 2 }
      );
      this.detail.player2.final_score = this.detail.moves_json[m]['totalscore'];
      this.detail.winner = 0;
      if (this.detail.player2.final_score > this.detail.player1.final_score) {
        this.detail.winner = 2;
      } else {
        this.detail.winner = 1;
      }
    }
  }

  LocChange(event: LocationChangeEvent): void {
    const url = event['url'];
    const moveno = url.substr(url.lastIndexOf('/') + 1);
    // console.log('moveno changed', moveno);
    this.onPanelPageChange(moveno);
  }

  onMenuPageChange(moveno: number): void {
    // console.log('move to ' + moveno + ' from pagination');
    this._pageChange(moveno);
    this.movepanel.currentMove = moveno;
  }

  onPanelPageChange(moveno: number): void {
    // console.log('move to ' + moveno + ' from pager');
    this._pageChange(moveno);
    this.movenav.currentPage = moveno;
  }

  onTileColorSet(tilecolors: {}): void {
    this.moveboard.changeTileColors(tilecolors);
  }

  private _pageChange(moveno: number): void {
    this.detail.currentmove = moveno;
    this.moveboard.moves = this.detail.moves_json[moveno - 1];
    this.detail.turn = this.detail.moves_json[moveno - 1];
    this._getPreviousMoves();
    this.moveboard.showMove(moveno);
    const oldpath = this.location.path();
    const substrold = oldpath.substr(0, oldpath.lastIndexOf('/') + 1);
    const newloc = `${substrold}${moveno}`;
    this.location.go(newloc);

    this.movepanel.updateView();
  }
}
