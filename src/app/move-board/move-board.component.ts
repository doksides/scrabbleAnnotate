import {Observable} from 'rxjs/Rx';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {GamesService} from '../services/games.service';

import * as _ from 'underscore';

@Component({selector: 'app-move-board;', templateUrl: './move-board.component.html', styleUrls: ['./move-board.component.css']})
export class MoveBoardComponent implements OnInit {
  localStorage : CoolLocalStorage;

  @Input()moves;
  @ViewChild('boardplay')gameboard : any;
  tileboard : any[];
  usedspots : any[] = [];
  lastspots : any[] = [];
  tilecolors : {} = {};

  constructor(private gamesrv : GamesService, localStorage : CoolLocalStorage) {
    this.localStorage = localStorage;
  }

  ngOnInit() {
    const cells = _.values(this.gameboard.nativeElement.getElementsByTagName('td'));
    this.tileboard = _.filter(cells, c => {
      return c
        .className
        .indexOf('markings') === -1;
    });

    const tc = this
      .localStorage
      .getObject('tilecolors');
    if (tc) {
      this.tilecolors = tc;
    }

    this.showMove(this.moves.moveno);

  }

  public showMove(moveno : number) {
    const {lastmove, tilespots, emptysqrs} = this
      .gamesrv
      .getPlay(+ moveno);

    if (tilespots) {
      const t = _.flatten(tilespots);
      const l = lastmove;
      this._arrangeTiles(t, l);
    }
    this._getUnusedCells(emptysqrs);
  }

  public changeTileColors(c?: {}) : void {
    if(c) {
      this.tilecolors = c;
    } else {
      const tc = this
        .localStorage
        .getObject('tilecolors');
      if (tc) {
        this.tilecolors = tc;
      }
    }
    const fgcolor = this.tilecolors['fgcolor'];
    const bgcolor = this.tilecolors['bgcolor'];

    // console.log(this.tilecolors); let t = _.filter(this.tileboard, (c) => {
    // return c.hasChildNodes('div') });
    const t = this.usedspots;

    _.each(t, v => {
      const div = v.firstElementChild;

      if (div) {
        const cL = div.classList;
        if (_.indexOf(cL, 'lastmove') === -1) {
          div.style.color = fgcolor;
          div.style.backgroundColor = bgcolor;
          const sub = div.firstElementChild;
          if (sub) {
            sub.style.color = fgcolor;
            sub.style.backgroundColor = 'transparent';
          }
        }
      }
    });
  }

  private _arrangeTiles(moves : any[], lastmove?: any[]) {
    if (moves) {
      const n = this.moves.moveno;
      _.each(moves, v => {
        const {spot, alpha, val} = v;
        const curspot = this.tileboard[spot];
        if (lastmove.length > 0 && _.indexOf(lastmove, spot) !== -1) {
          this
            .lastspots
            .push(curspot);
          curspot.innerHTML = `<div class="tilesm lastmove  embossed-heavy animated flash">${alpha}<sub class="tilevalsm">${val}</sub></div>`;
        } else {
          this
            .usedspots
            .push(curspot);
          curspot.innerHTML = `<div class="tilesm  embossed-heavy">${alpha}<sub class="tilevalsm">${val}</sub></div>`;
        }
      });
      if (this.tilecolors && this.usedspots.length > 0) {
        this.changeTileColors(this.tilecolors);
        // console.log(this.usedspots);
      }
    }
  }

  private _removeTile(tiles : number[]) {
    if (tiles) {
      _.each(tiles, v => {
        this.tileboard[v].innerHTML = '';
      });
    }
  }

  _getUnusedCells(emptysqrs) {
    const unusedsqrs = _.filter(this.tileboard, t => {
      return t.childElementCount === 0;
    });
    const s = _.size(unusedsqrs);
    // console.log(s); console.dir(unusedsqr)
    if (s !== emptysqrs) {
      this._removeTile(emptysqrs);
    }
  }
}
