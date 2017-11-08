import { Component, Input, OnInit } from '@angular/core';
// import {ActivatedRoute, Router} from '@angular/router';
import { GamesService } from '../services/games.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-ui-tracking',
  templateUrl: './ui-tracking.component.html',
  styleUrls: ['./ui-tracking.component.css']
})
export class UiTrackingComponent implements OnInit {
  @Input() gameinfo;
  // TileRack vars
  public remTileSet: {} = {};

  constructor(private gamesrv: GamesService) {}

  ngOnInit() {
    // this.remTiles = this.gameinfo.turn.rem_tiles;
    this.displayTracking();
  }

  public displayTracking() {
    this.remTileSet = this.gameinfo.turn.rem_tiles;
    console.log(this.gameinfo.turn);
  }
}
