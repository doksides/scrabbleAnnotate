import { StorageChangeArguments } from 'angular2-cool-storage';
import { take } from 'rxjs/operator/take';
import { Observable } from 'rxjs/Rx';
import { Injectable, Inject } from '@angular/core';

import {
  Http,
  URLSearchParams,
  Headers,
  RequestOptions,
  Response
} from '@angular/http';
import {
  BASEURL,
  CUSTOMAPI,
  // FULLTILESET,
  REQUESTARGS,
  TOTAL_SQR
} from '../providers/providers';
import { WpApiCustom } from 'wp-api-angular';
import * as _ from 'underscore';

@Injectable()
export class GamesService {
  boardmatrix = [
    _.range(15),
    _.range(15, 30),
    _.range(30, 45),
    _.range(45, 60),
    _.range(60, 75),
    _.range(75, 90),
    _.range(90, 105),
    _.range(105, 120),
    _.range(120, 135),
    _.range(135, 150),
    _.range(150, 165),
    _.range(165, 180),
    _.range(180, 195),
    _.range(195, 210),
    _.range(210, 225)
  ];

  WORD_CONCAT_STR = '.';
  cache = null;
  usedsqrs: number[] = [];
  moves_analysis;
  tens = 'QZ';
  eights = 'JX';
  fours = 'YVWFH';
  threes = 'BCMP';
  twos = 'DG';
  fives = 'K';
  ones = 'AEILNORSTU';
  isblank = 'abcdefghijklmnopqrstuvwxyz';
  totaltiles = 100;
  api: string;
  fulltileset = [
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'A',
    'B',
    'B',
    'C',
    'C',
    'D',
    'D',
    'D',
    'D',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'F',
    'F',
    'G',
    'G',
    'G',
    'H',
    'H',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'I',
    'J',
    'K',
    'L',
    'L',
    'L',
    'L',
    'M',
    'M',
    'N',
    'N',
    'N',
    'N',
    'N',
    'N',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'P',
    'P',
    'Q',
    'R',
    'R',
    'R',
    'R',
    'R',
    'R',
    'S',
    'S',
    'S',
    'S',
    'T',
    'T',
    'T',
    'T',
    'T',
    'T',
    'U',
    'U',
    'U',
    'U',
    'V',
    'V',
    'W',
    'W',
    'X',
    'Y',
    'Y',
    'Z',
    '?',
    '?'
  ];

  private url = '/game';

  constructor(
    @Inject(Http) public http: Http,
    @Inject(BASEURL) private baseurl,
    @Inject(CUSTOMAPI) private custapi,
    @Inject(TOTAL_SQR) private totalsqr,
    // @Inject(FULLTILESET) private fulltileset,
    private wpApiCustom: WpApiCustom,
    @Inject(REQUESTARGS) private options
  ) {
    this.custapi = this.baseurl + this.custapi;
  }

  public getTileValue(tile: string): string {
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

  public getPlay(moveno: number) {
    const r = this.moves_analysis;
    const tilespots = _.pluck(_.first(r, moveno), 'tile_play');
    const availablespots = r[moveno - 1].availablespots;
    const result = {
      lastmove: _.pluck(_.last(tilespots), 'spot'),
      tilespots: tilespots,
      emptysqrs: availablespots
    };
    // console.log(result);
    return result;
  }

  private _getBingos(moves_json) {
    const turn = _.pluck(moves_json, 'tile_play');
    const bingo_index = _.chain(turn)
      .filter(p => {
        return p.length === 7;
      })
      .map(p => {
        return _.indexOf(turn, p);
      })
      .value();
    // console.log('bingos ' + bingo_index);
    return bingo_index;
  }

  private _getWords(moves_json) {
    const boardsqr: number[] = _.range(225);
    const allsqrs = _.chain(moves_json)
      .pluck('tile_play')
      .flatten()
      .value();

    // console.log(allsqrs);
    return _.map(moves_json, (val, key, list) => {
      if (val['event'] === 'chall-') {
        const comment_base = `${val['name']} scores ${val['score']} for `;
        // Get previous phoney word played
        const phoney = list[key - 1]['fullword'];
        const phoney_other_words = list[key - 1]['other_words'] || '';

        val[
          'comment'
        ] = `${comment_base} phoney word ${phoney.toUpperCase()} ${phoney_other_words.words} *`;
      }
      if (val['event'] === 'play') {
        const availablespots = val['availablespots'],
          moveno = val['moveno'],
          mainword = val['fullword'];
        let next_sqr = 1,
          orient = 'vertical';
        if (val['orient'] === 1) {
          next_sqr = 15;
          orient = 'horizontal';
        }
        const arrayColumn = (arr, n) => arr.map(x => x[n]);
        const boardcols = [
          arrayColumn(this.boardmatrix, 0),
          arrayColumn(this.boardmatrix, 1),
          arrayColumn(this.boardmatrix, 2),
          arrayColumn(this.boardmatrix, 3),
          arrayColumn(this.boardmatrix, 4),
          arrayColumn(this.boardmatrix, 5),
          arrayColumn(this.boardmatrix, 6),
          arrayColumn(this.boardmatrix, 7),
          arrayColumn(this.boardmatrix, 8),
          arrayColumn(this.boardmatrix, 9),
          arrayColumn(this.boardmatrix, 10),
          arrayColumn(this.boardmatrix, 11),
          arrayColumn(this.boardmatrix, 12),
          arrayColumn(this.boardmatrix, 13),
          arrayColumn(this.boardmatrix, 14)
        ];

        // board squares on which move was made
        const sqrs = _.pluck(val['tile_play'], 'spot');
        const usedsqrs = _.difference(boardsqr, availablespots);

        const otherwords = _.chain(sqrs)
          .map(v => {
            if (orient === 'horizontal') {
              return this._checkOtherWords(
                v,
                boardcols,
                usedsqrs,
                allsqrs,
                next_sqr
              );
            } else {
              return this._checkOtherWords(
                v,
                this.boardmatrix,
                // boardrows,
                usedsqrs,
                allsqrs,
                next_sqr
              );
            }
          })
          .filter(w => {
            return _.size(w) > 0;
          })
          // .unzip()
          .value();
        if (otherwords.length > 0) {
          const words = _.unzip(otherwords),
            total = otherwords.length;
          const other_words = {
            words: words.join(''),
            total: total
          };
          val['other_words'] = other_words;
          // console.log(moveno, mainword, sqrs, other_words);
        }
      }
    });
  }

  private _checkOtherWords(val, board_row_col, used, lookup, step) {
    // Find out where (column/row) this tile is placed on
    const r = _.filter(board_row_col, v => {
        return _.contains(v, val);
      }),
      // flatten the arr
      flatr = _.flatten(r),
      // Find the occupied/used spaces on that row/column
      occu_sqrs = _.intersection(flatr, used);

    // From list of numbered squares occupied by tiles (15 step).
    // Reduce array of squares to array of array of adjacent
    // and non-adjacent squares. Split at (space > 15 vertical, space > 1 horizontal)
    // non-adjacent squares

    const adj = occu_sqrs.reduceRight((prev, cur, index, list) => {
      prev[0] = prev[0] || [];
      const old_val = list[index + 1] || 0;

      if (cur + step === old_val) {
        prev[0].unshift(cur);
      } else {
        prev.unshift([cur]);
      }
      return prev;
    }, []);

    // Filter out square not connected to current move tile (val)
    // and remove if adjacent connected used squares are not at least 2

    return (
      _.chain(adj)
        .filter(f => {
          return _.contains(f, val);
        })
        .reject(a => {
          return _.size(a) < 2;
        })
        // Finally lookup letter value of squares
        .map(s => {
          const letters = _.map(s, v => {
            const k = _.findWhere(lookup, { spot: v });
            return k['alpha'];
          });
          // Join and return
          return letters.join('');
        })
        .value()
    );
  }

  private _checkBingos(moves_json) {
    const b = this._getBingos(moves_json);
    // if a bonus was played in this turn
    return _.map(moves_json, (val, key, list) => {
      const comment_base = `${val['name']} scores ${val['score']} for `;
      const isBonus = _.contains(b, key);
      if (isBonus) {
        val['bonus'] = true;
      }
      if (isBonus) {
        val['comment'] = `${comment_base} bonus word ${val[
          'fullword'
        ].toUpperCase()} `;
      }
    });
  }

  private modifySingleData(res: Response): {} {
    const data = res.json();
    const moves = JSON.parse(data[0].moves_json);
    this.moves_analysis = this.analyzeMoves(moves);
    this._getWords(moves);
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
      ...data[0].liked_by
        ? {
            likes_count: data[0].liked_by.length,
            liked_by: data[0].liked_by
          }
        : {
            likes_count: 0,
            liked_by: null
          },

      game_logo: data[0].event_logo.guid || 'images/nsflogo.png',
      ongoing: data[0].game_ongoing[0],
      annotation: data[0].moves,
      moves_json: moves,
      noofturns: JSON.parse(data[0].moves_json).length,
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

  private modifyData(res: Response): {} {
    const data = res.json();

    return data.map((val, key) => {
      // console.log(key, val.id);
      const modified_data = {
        gameid: val.id,
        title: val.title.rendered,
        tag: val.tagname,
        tagcount: val.tagcount,
        // Conditionally add properties
        ...val.liked_by
          ? {
              likes_count: val.liked_by.length,
              liked_by: val.liked_by
            }
          : {
              likes_count: 0,
              liked_by: null
            },
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

  public loadGameData(page?: string): Observable<Response> {
    const pageno = page || '1';
    const options: any = [];
    options.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    };
    const search = new URLSearchParams();
    search.append('context', 'view');
    search.append('page', pageno);
    options.search = search;
    const obs$ = this.wpApiCustom.httpGet(this.url, options);
    return (
      obs$
        .map(res => {
          const gamedata = this.modifyData(res);
          return {
            data: gamedata,
            total: res.headers.get('X-WP-Total'),
            totalpages: res.headers.get('X-WP-TotalPages'),
            page: pageno
          };
        })
        // .do(data => console.log(data))
        .catch(this.handleError)
    );
  }

  public getSingleGame(slug: string) {
    const options: any = [];
    options.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    };
    const search = new URLSearchParams();
    search.append('context', 'view');
    search.append('slug', slug);
    options.search = search;
    // console.log('gettin...');
    const req$ = this.wpApiCustom.httpGet(this.url, options);
    return req$
      .map(detail => this.modifySingleData(detail))
      .do(data => console.log(data))
      .catch(this.handleError);
  }

  // public getTagCount() : Observable < Response > {   let tagcount = [];   const
  // options: any = [];   options.headers = {     'Content-Type':
  // 'application/json;charset=UTF-8'   };   options.url = this.custapi +
  // '/tagcount';   const obs$ = this     .wpApiCustom     .httpGet('', options);
  // return obs$   // .map(this.extractData)     .map(response => tagcount =
  // response.json())     .catch((error : any) =>
  // Observable.throw(error.json().error || 'Server error')); }

  public getGamesByTagSlug(
    tag_slug: string,
    page?: string
  ): Observable<Response> {
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
    const obs$ = this.wpApiCustom.httpGet(this.url, options);
    return (
      obs$
        .debounceTime(1000)
        .map(res => {
          const gamedata = this.modifyData(res);
          return {
            data: gamedata,
            total: res.headers.get('X-WP-Total'),
            totalpages: res.headers.get('X-WP-TotalPages'),
            page: pageno
          };
        })
        // .do(data => console.log(data))
        .catch(this.handleError)
    );
    // .catch((error : any) => Observable.throw(error.json().error || 'Server
    // error'));
  }

  public getGamesByTag(term_id: string, page?: string): Observable<Response> {
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
    const obs$ = this.wpApiCustom.httpGet(this.url, options);
    return obs$
      .debounceTime(500)
      .map(res => {
        const gamedata = this.modifyData(res);
        return {
          data: gamedata,
          total: res.headers.get('X-WP-Total'),
          totalpages: res.headers.get('X-WP-TotalPages'),
          page: pageno
        };
      })
      .do(data => console.log(data))
      .catch(this.handleError);
    // .catch((error : any) => Observable.throw(error.json().error || 'Server
    // error'));
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || [];
  }

  private handleError(error: any) {
    const errMsg = error.message
      ? error.message
      : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  analyzeMoves(json) {
    let availablespots: number[] = _.range(225);
    // console.log(`availablespots = ${availablespots.length}`);
    let total_unplayed_tiles = this.totaltiles;
    let rem_tiles = this.fulltileset;
    // let unseen_tiles = this.fulltileset;

    // Start looping through moves
    return _.map(json, (val, key, list) => {
      // console.log(val['moveno']);
      console.log(val);
      val['rem_tiles'] = rem_tiles;
      const comment_base = `${val['name']} scores ${val['score']} for `;
      val['bonus'] = false;
      const movetilesqr = [];

      if (val['event'] === 'rack+') {
        val['fullword'] = val['word'];
        val['comment'] = `${comment_base} ${val[
          'word'
        ]} left on opponent's rack`;
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
        val['comment'] = ` ${val['name']} gets ${val[
          'score'
        ]} extra (challenge penalty) points`;
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
        let startsqr = +col + +row * 15;
        let nextsqr;

        +orient !== 1 ? (nextsqr = 15) : (nextsqr = 1);

        for (let x = 0; x < len; x++) {
          // Extract hotspots
          if (_.indexOf(_.flatten(availablespots), startsqr) !== -1) {
            const alpha = word.charAt(x);
            const alphaVal = this.getTileValue(alpha);
            const tilesqr = {
              spot: startsqr,
              alpha: alpha,
              val: alphaVal
            };
            // Get used tiles for tracking!
            tiles_used.push(alpha);
            let tile_letter = alpha;
            if (alphaVal === '0') {
              tile_letter = '?';
            }
            movetilesqr.push(tilesqr);
            availablespots = _.without(availablespots, startsqr);
          }
          startsqr += nextsqr;
          // console.log(startsqr);
        }
        total_unplayed_tiles -= movetilesqr.length;

        val['tile_play'] = movetilesqr;

        if (word.indexOf(this.WORD_CONCAT_STR) >= 0) {
          const len_word = word.length;
          let start_word = +col + +row * 15;
          for (let c = 0; c < len_word; c++) {
            if (word.charAt(c) === this.WORD_CONCAT_STR) {
              const t = _.compact(_.pluck(list, 'tile_play'));
              // console.log(start_word, t);
              const f = _.chain(t)
                .flatten(true)
                .findWhere({ spot: start_word })
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
        val['tiles_used'] = tiles_used;

        // Enumerate remaining letters by removing used tiles
        _.each(tiles_used, t => {
          // consider lowercase to represent 'blanks'
          if (t === t.toLowerCase()) {
            t = '?';
          }
          const index = rem_tiles.indexOf(t);
          if (index !== -1) {
            rem_tiles.splice(index, 1);
          }
        });
        // console.log(rem_tiles.length, rem_tiles);
      } else if (val['event'] === 'chall-') {
        // if there was a successful challenge remove tiles used previously
        const prev = _.pluck(list[key - 1]['tile_play'], 'spot');
        availablespots = _.union(availablespots, prev);
        val['tile_play'] = [];
        // also get the number of tiles played previously and add to total unplayed tiles
        // prev.length is sum of tiles played previous move
        total_unplayed_tiles += prev.length;
        const previous_tiles = _.pluck(list[key - 1]['tile_play'], 'alpha');

        // add tiles back to unused tileset
        _.each(previous_tiles, t => {
          // consider lowercase to represent 'blanks'
          if (t === t.toLowerCase()) {
            t = '?';
          }
          rem_tiles.unshift(t);
        });
      } else {
        val['tile_play'] = [];
      }
      // val['rem_tiles'] = rem_tiles;
      // console.log(rem_tiles);
      val['total_unplayed_tiles'] = total_unplayed_tiles;
      val['availablespots'] = availablespots;
      return _.pick(val, 'tile_play', 'availablespots');
    });
  }
}
