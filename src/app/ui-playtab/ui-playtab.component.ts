import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GamesService } from '../services/games.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-ui-playtab',
  templateUrl: './ui-playtab.component.html',
  styleUrls: ['./ui-playtab.component.css']
})
export class UiPlaytabComponent implements OnInit {
  @Input() gameinfo;

  // TileRack vars
  public currentTiles: string;
  public currTileSet: {};
  public whoseTurn: boolean;

  constructor(private gamesrv: GamesService) {}

  ngOnInit() {
    this.initTiles();
  }

  private _getTurn() {
    if (parseInt(this.gameinfo.turn.player, 10) === 1) {
      this.whoseTurn = true;
    } else {
      this.whoseTurn = false;
    }
    // console.log('turn:  player ' + this.gameinfo.turn.player);
  }

  public initTiles() {
    this._getTurn();
    if (this.gameinfo.turn.rack != null && this.gameinfo.turn.rack.length > 0) {
      this.currentTiles = this.gameinfo.turn.rack;
      this.currTileSet = this._getTileSet(this.currentTiles);
    } else {
      this.currentTiles = '';
      this.currTileSet = {};
    }
    // console.log('ct ' + this.currentTiles); console.log(this.currTileSet);
  }

  private _getTileSet(tiles: string): {} {
    const rackarr = tiles.split('');
    return rackarr.map((val, key) => {
      const rack = {
        tile: val,
        value: this.gamesrv.getTileValue(val)
      };
      return rack;
    });
  }
}
