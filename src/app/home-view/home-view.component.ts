import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GamesService } from '../services/games.service';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as _ from 'underscore';

@Component({
  selector: 'app-display',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css']
})
@AutoUnsubscribe([])
export class HomeViewComponent implements OnInit {
  @Input() private games;
  tagcloud: Array<CloudData>;
  tagcount;
  model: any = {};
  error = '';

  // user : any = {}; token : string; jwtHelper : JwtHelper = new JwtHelper();

  title = 'Annotated Games List';
  routename: string;

  options: CloudOptions = {
    width: 0.9,
    height: 300,
    overflow: true
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private backend: GamesService
  ) {
    this.routename = this._route.snapshot.data['routename'];
    this.title = this._route.snapshot.data['title'];
    this.games = this._route.snapshot.data['data'];
    // console.log('tagcount...', this.tagcount);
    if (this.routename === 'tags' && this.games === undefined) {
      this.getGamesListByTag('1');
    }
  }

  ngOnInit() {
    // this.getUserData();
    this.tagcloud = this.formatTagCount();
    if (this.routename === 'tag_slug') {
      const slug = this._route.snapshot.params.slug;
      this.title = `${this.title}  ${slug}`;
    }
  }

  private formatTagCount(): Array<CloudData> {
    const tagcount = this.games['data'][0]['tagcount'];
    return _.map(tagcount, val => {
      const tagdata = {
        text: `${val['text']}`,
        weight: val['weight'] * 10,
        link: ''
        // link: `games/tagged/${val['slug']}`
      };
      return tagdata;
    });
  }

  public getGamesList(pageno?: string): any {
    const obs = this.backend.loadGameData(pageno);
    obs.subscribe(
      response => (this.games = response),
      error => console.log(error)
    );
  }

  public getGamesListByTag(pageno: string): any {
    const term_id = this._route.snapshot.params.id;
    const obs = this.backend.getGamesByTag(term_id, pageno);
    // obs.subscribe(response => this.games = response);
    obs.subscribe(
      response => (this.games = response),
      error => console.log(error)
    );
    this.games = this._route.snapshot.data['data'];
  }

  public getGamesListByTagSlug(pageno: string): any {
    const tag_slug = this._route.snapshot.params.slug;
    const obs = this.backend.getGamesByTagSlug(tag_slug, pageno);
    // obs.subscribe(response => this.games = response);
    obs.subscribe(
      response => (this.games = response),
      error => console.log(error)
    );
    this.games = this._route.snapshot.data['data'];
  }

  public tagClicked(eventType: string, e: CloudData) {
    console.log(eventType);
    const slug = e['text'];
    this._router.navigate([`/games/tagged/${slug}`]);
    const lastIndex = this.title.lastIndexOf(' ');
    this.title = this.title.substring(0, lastIndex);
    this.title = `${this.title}  ${slug}`;
  }

  public onHomePgChanged(page: number): void {
    // console.log(page)
    const pageno = `${page}`;
    if (this.routename === 'tag_id') {
      this.getGamesListByTag(pageno);
    } else if (this.routename === 'tag_slug') {
      this.getGamesListByTagSlug(pageno);
    } else {
      this.getGamesList(pageno);
    }
  }
}
