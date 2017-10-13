import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GamesService} from '../services/games.service';
import * as _ from 'underscore';

@Component({selector: 'app-ui-movelist', templateUrl: './ui-movelist.component.html', styleUrls: ['./ui-movelist.component.css']})
export class UiMovelistComponent implements OnInit {
  @Input()gameinfo;
  movelist : any;
  currentTurn : number;

  constructor(private gamesrv : GamesService) {}

  ngOnInit() {
    this.buildMoveList();
  }

  public buildMoveList() {
    this.movelist = this.gameinfo.moves_json;
    this.currentTurn = this.gameinfo.turn.moveno;
  }

  /*
  * _modifyList
  * Substitute player number with real (player) names
  */

  private _modifyList() {
    this.movelist = this.gameinfo.moves_json;
    return _.map(this.movelist, (val, key) => {
      if (parseInt(val['player'], 10) === 1) {
        val['player'] = this.gameinfo.player_1.name;
      }
      if (parseInt(val['player'], 10) === 2) {
        val['player'] = this.gameinfo.player_2.name;
      }
    });
  }
}
