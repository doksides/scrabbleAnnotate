import {Observable} from 'rxjs/Rx';
import {Injectable, Inject} from '@angular/core';
import {Http, URLSearchParams, Headers, RequestOptions, Response} from '@angular/http';
import {BASEURL, CUSTOMAPI, TOTAL_SQR, REQUESTARGS} from '../providers/providers';
import {WpApiCustom} from 'wp-api-angular';
import * as _ from 'underscore';

@Injectable()
export class GamesService {

  WORD_CONCAT_STR = '.';
  cache = null;
  usedsqrs : number[] = [];
  moves_analysis;
  tens = 'QZ';
  eights = 'JX';
  fours = 'YVWFH';
  threes = 'BCMP';
  twos = 'DG';
  fives = 'K';
  ones = 'AEILNORSTU';
  isblank = 'abcdefghijklmnopqrstuvwxyz';
  api : string;
  private url = '/game';

  constructor(@Inject(Http)public http : Http, @Inject(BASEURL)private baseurl, @Inject(CUSTOMAPI)private custapi, @Inject(TOTAL_SQR)private totalsqr, private wpApiCustom : WpApiCustom, @Inject(REQUESTARGS)private options) {
    this.custapi = this.baseurl + this.custapi;
  }

  public getTileValue(tile : string) : string {
    let tileVal = '0';
    if (this.ones.indexOf(tile) > -1) {
      tileVal = '1';
    }
    if (this.twos.indexOf(tile) > -1) {
      tileVal = '2';
    }
    if (this.tens.indexOf(tile) > -1) {
      tileVal = '10';
    }
    if (this.eights.indexOf(tile) > -1) {
      tileVal = '8';
    }
    if (this.fives.indexOf(tile) > -1) {
      tileVal = '5';
    }
    if (this.fours.indexOf(tile) > -1) {
      tileVal = '4';
    }
    if (this.threes.indexOf(tile) > -1) {
      tileVal = '3';
    }
    if (this.isblank.indexOf(tile) > -1) {
      tileVal = '0';
    }
    return tileVal;
  }

  public getPlay(moveno : number) {
    const r = this.moves_analysis;
    const tilespots = _.pluck(_.first(r, moveno), 'tilespots');
    const availablespots = r[moveno - 1].availablespots;
    const result = {
      lastmove: _.pluck(_.last(tilespots), 'spot'),
      tilespots: tilespots,
      emptysqrs: availablespots
    };
    return result;
  }

  public getBingos() {
    const m = this.moves_analysis;
    const tilespots = _.pluck(m, 'tilespots');
    // const bingo_count = _.countBy(tilespots, p => {   return p.length === 7     ?
    // 'bingo'     : 'nonbingo' });
    const bingo_index = _
      .chain(tilespots)
      .filter(p => {
        return p.length === 7
      })
      .map(p => {
        return _.indexOf(tilespots, p)
      })
      .value();
    console.log('bingos ' + bingo_index);
    return bingo_index;
  }

  private modifySingleData(res : Response) : {}
  {
    const data = res.json();
    const moves = JSON.parse(data[0].moves_json);
    this.moves_analysis = this.analyzeMoves(moves);
    this._checkBingos(moves);

    // console.log(this.moves_analysis);
    const mydata = {
      gameid: data[0].id,
      title: data[0].title.rendered,
      tag: data[0].tagname,
      desc: data[0].content.rendered,
      date: new Date(data[0].game_date),
      chall: data[0].challenge_penalty || '+10 points',
      dic: data[0].dictionary[0],
      slug: data[0].slug,

      // Conditionally add properties
      ...(data[0].liked_by
        ? {
          likes_count: data[0].liked_by.length,
          liked_by: data[0].liked_by
        }
        : {
          likes_count: 0,
          liked_by: null
        }),

      game_logo: data[0].event_logo.guid || 'images/nsflogo.png',
      ongoing: data[0].game_ongoing[0],
      annotation: data[0].moves,
      moves_json: moves,
      noofturns: JSON
        .parse(data[0].moves_json)
        .length,
      player_1: {
        name: data[0].player1[0].post_title,
        photo: data[0].player1[0].photo.guid,
        gender: data[0].player1[0].gender,
        country: data[0].player1[0].country
      },
      player_2: {
        name: data[0].player2[0].post_title,
        photo: data[0].player2[0].photo.guid,
        gender: data[0].player2[0].gender,
        country: data[0].player2[0].country
      }
    };
    return mydata;
  }

  private modifyData(res : Response) : {}
  {
    const data = res.json();

    return data.map((val, key) => {
      console.log(key, val.id);
      const modified_data = {
        gameid: val.id,
        title: val.title.rendered,
        tag: val.tagname,
        tagcount: val.tagcount,
        // Conditionally add properties
        ...(val.liked_by
          ? {
            likes_count: val.liked_by.length,
            liked_by: val.liked_by
          }
          : {
            likes_count: 0,
            liked_by: null
          }),
        desc: val.content.rendered,
        player1: val.player1[0].post_title,
        player1_photo: val.player1[0].photo.guid,
        player1_gender: val.player1[0].gender,
        player1_country: val.player1[0].country,
        player2: val.player2[0].post_title,
        player2_photo: val.player2[0].photo.guid,
        player2_gender: val.player2[0].gender,
        player2_country: val.player2[0].country,
        date: new Date(val.game_date) || null,
        chall: val.challenge_penalty || '+10 points',
        dic: val.dictionary[0],
        slug: val.slug,
        game_logo: val.event_logo.guid || 'images/nsflogo.png',
        ongoing: val.game_ongoing[0] || 'No',
        moves: val.moves_json[0],
        noofturns: val.moves_json[0].length,
        moveno: 1
      };

      return modified_data;
    });

  }

  /**
   * loadGameData
   * Concatenated observable of games data and tagcount
   * @return Observable of concatenated games and tagcount data
   */

  public loadGameData(page?: string) : Observable < Response > {

    const pageno = page || '1';
    const options: any = [];
    options.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    };
    const search = new URLSearchParams();
    search.append('context', 'view');
    search.append('page', pageno);
    options.search = search;
    const obs$ = this
      .wpApiCustom
      .httpGet(this.url, options);

    return obs$.map(res => {
      const gamedata = this.modifyData(res);
      return {
        data: gamedata,
        total: res
          .headers
          .get('X-WP-Total'),
        totalpages: res
          .headers
          .get('X-WP-TotalPages'),
        page: pageno
      };
    }).do
      (data => console.log(data)).catch(this.handleError);
    }

  public getSingleGame(slug : string) {
    const options : any = [];
    options.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    };
    const search = new URLSearchParams();
    search.append('context', 'view');
    search.append('slug', slug);
    options.search = search;
    console.log('gettin...');
    const req$ = this
      .wpApiCustom
      .httpGet(this.url, options);
    return req$
      .map(detail => this.modifySingleData(detail))
      .do
        (data => console.log(data)).catch(this.handleError);
        // .catch((error : any) => Observable.throw(error.json().error || 'Server
        // error'));
      }

  // public getTagCount() : Observable < Response > {   let tagcount = [];   const
  // options: any = [];   options.headers = {     'Content-Type':
  // 'application/json;charset=UTF-8'   };   options.url = this.custapi +
  // '/tagcount';   const obs$ = this     .wpApiCustom     .httpGet('', options);
  // return obs$   // .map(this.extractData)     .map(response => tagcount =
  // response.json())     .catch((error : any) =>
  // Observable.throw(error.json().error || 'Server error')); }

  public getGamesByTagSlug(tag_slug : string, page?: string) : Observable < Response > {
    const pageno = page || '1';
    const options: any = [];
    options.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    };
    const search = new URLSearchParams();
    search.append('context', 'view');
    search.append('filter[paged]', pageno);
    search.append('filter[tag]', tag_slug);
    options.search = search;
    const obs$ = this
      .wpApiCustom
      .httpGet(this.url, options);
    return obs$
      .debounceTime(1000)
      .map(res => {
        const gamedata = this.modifyData(res);
        return {
          data: gamedata,
          total: res
            .headers
            .get('X-WP-Total'),
          totalpages: res
            .headers
            .get('X-WP-TotalPages'),
          page: pageno
        };
      })
      .do
        (data => console.log(data)).catch(this.handleError);
        // .catch((error : any) => Observable.throw(error.json().error || 'Server
        // error'));
      }

  public getGamesByTag(term_id : string, page?: string) : Observable < Response > {
    const pageno = page || '1';
    const options: any = [];
    options.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    };
    const search = new URLSearchParams();
    search.append('context', 'view');
    search.append('page', pageno);
    search.append('tags', term_id);
    options.search = search;
    const obs$ = this
      .wpApiCustom
      .httpGet(this.url, options);
    return obs$
      .debounceTime(500)
      .map(res => {
        const gamedata = this.modifyData(res);
        return {
          data: gamedata,
          total: res
            .headers
            .get('X-WP-Total'),
          totalpages: res
            .headers
            .get('X-WP-TotalPages'),
          page: pageno
        };
      })
      .do
        (data => console.log(data)).catch(this.handleError);
        // .catch((error : any) => Observable.throw(error.json().error || 'Server
        // error'));
      }

  private extractData(res : Response) {
    const body = res.json();
    return body || [];
  }

  private handleError(error : any) {
    const errMsg = (error.message)
      ? error.message
      : error.status
        ? `${error.status} - ${error.statusText}`
        : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  private _checkBingos(json) {

    // get bingo turns
    const b = this.getBingos();
    // if a bonus was played in this turn
    return _.map(json, (val, key, list) => {
      const comment_base = `${val['name']} scores ${val['score']} for `;
      const isBonus = _.contains(b, key);

      if (isBonus) {
        val['bonus'] = true;
      }
      if (isBonus) {
        val['comment'] = `${comment_base} bonus word <strong>${val['fullword'].toUpperCase()}</strong> `;
      }
    });
  }

  analyzeMoves(json) {

    let availablespots : number[] = _.range(225);
    // console.log(`availablespots = ${availablespots.length}`);
    return _.map(json, (val, key, list) => {
      console.log(val['moveno']);
      const comment_base = `${val['name']} scores ${val['score']} for `;
      val['bonus'] = false;

      const movetilesqr = [];
      if (val['event'] === 'rack+') {
        val['fullword'] = val['word'];
        val['comment'] = `${comment_base} ${val['word']} left on opponent's rack`;
      }

      if (val['event'] === 'pass') {
        val['comment'] = `${val['name']} passes turn`;
      }
      if (val['event'] === 'exch') {
        val['comment'] = `${val['name']} exchanges tiles`;
      }
      if (val['event'] === 'chall+') {
        const l = list[key - 1];
        const word_score = parseInt(l['score'], 10);
        val['comment'] = ` ${val['name']} gets ${val['score']} extra (challenge penalty) points`;
      }

      if (val['event'] === 'play') {
        const tiles_used = [];
        const moveno = val['moveno'];
        // tiles_used[moveno] = [];
        const word = val['word'];
        val['fullword'] = '';
        const len = val['word'].length;
        const row = val['row'];
        const col = val['col'];
        const orient = val['orient'];
        let startsqr = +col + (+ row * 15);
        let nextsqr;

        +orient !== 1
          ? nextsqr = 15
          : nextsqr = 1;

        for (let x = 0; x < len; x++) {
          // Extract hotspots
          if (_.indexOf(_.flatten(availablespots), startsqr) !== -1) {
            const alpha = word.charAt(x);
            const alphaVal = this.getTileValue(alpha);
            const tilesqr = {
              'spot': startsqr,
              'alpha': alpha,
              'val': alphaVal
            };
            // Get used tiles for tracking!
            tiles_used.push(alpha);
            let tile_letter = alpha;
            if (alphaVal === '0') {
              tile_letter = '?';
            }
            // const i = val['tile_rem'].indexOf(tile_letter); if (i !== -1) {
            // val['tile_rem'].splice(i, 1); }
            movetilesqr.push(tilesqr);
            availablespots = _.without(availablespots, startsqr);
          }
          startsqr += nextsqr;
          // console.log(startsqr);
        }

        val['tilespots'] = movetilesqr;

        if (word.indexOf(this.WORD_CONCAT_STR) >= 0) {
          // console.log('=>', word, word.length);
          const len_word = word.length;
          let start_word = +col + (+ row * 15);
          for (let c = 0; c < len_word; c++) {
            if (word.charAt(c) === this.WORD_CONCAT_STR) {
              const t = _.compact(_.pluck(list, 'tilespots'));
              // console.log(start_word, t);
              const f = _
                .chain(t)
                .flatten(true)
                .findWhere({spot: start_word})
                .value();
              // console.log(f.alpha)
              val['fullword'] += f.alpha;
            } else {
              val['fullword'] += word.charAt(c);
            }
            start_word += nextsqr;
          }
        } else {
          val['fullword'] = val['word'];
        }
        val['comment'] = `${comment_base} ${val['fullword'].toUpperCase()} `;
        // val['tiles_used'] = tiles_used; console.log(val['moveno'], val['tiles_used'],
        // val['tile_rem']);
      } else if (val['event'] === 'chall-') {
        /*if there was a successful challenge remove tiles used previously*/
        const prev = _.pluck(list[key - 1]['tilespots'], 'spot');
        // var prev = _.pluck(list[key - 1].tilespots.pop(), 'spot'); const
        // prev_tiles_used = list[key - 1]['tiles_used']; val['tile_rem'] =
        // _.union(val['tile_rem'], prev_tiles_used); console.log(val['event'],
        // prev_tiles_used); console.log(val['moveno'], val['tiles_used']);
        availablespots = _.union(availablespots, prev);
        val['tilespots'] = [];
        val['comment'] = `${comment_base} phoney word ${val['fullword'].toUpperCase()}* `;
      } else {
        val['tilespots'] = [];
      }
      val['availablespots'] = availablespots;
      return _.pick(val, 'tilespots', 'availablespots');
    });

  }

}
