import {Component, Input, OnInit} from '@angular/core';
// import {ActivatedRoute, Router} from '@angular/router';
import {GamesService} from '../services/games.service';
import * as _ from 'underscore';

@Component({selector: 'app-ui-tracking', templateUrl: './ui-tracking.component.html', styleUrls: ['./ui-tracking.component.css']})
export class UiTrackingComponent implements OnInit {
  @Input()gameinfo;

  constructor(private gamesrv : GamesService) {}

  ngOnInit() {}

}
