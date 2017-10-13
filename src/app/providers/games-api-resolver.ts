import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GamesService} from '../services/games.service';

@Injectable()
export class GamesResolver implements Resolve < any > {
  constructor(private backend : GamesService) {}
  resolve(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : Observable < any >| Promise < any >| any {
    // console.log('returning resolved games data');
    return this
      .backend
      .loadGameData();
  }

}

@Injectable()
export class TagsResolver implements Resolve < any > {
  constructor(private backend : GamesService) {}
  resolve(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : Observable < any >| Promise < any >| any {
    // console.log('returning resolved tag games');
    return this
      .backend
      .getGamesByTag(route.params.id);
  }

}
@Injectable()
export class TagSlugResolver implements Resolve < any > {
  constructor(private backend : GamesService) {}
  resolve(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : Observable < any >| Promise < any >| any {
    // console.log('returning resolved tag games');
    return this
      .backend
      .getGamesByTagSlug(route.params.slug);
  }

}

// @Injectable() export class TagsCountResolver implements Resolve < any > {
// constructor(private backend : GamesService) {}   resolve(route :
// ActivatedRouteSnapshot, state : RouterStateSnapshot) : Observable < any >|
// Promise < any >| any {     // console.log('returning tag count');     return
// this       .backend       .getTagCount();   } }
@Injectable()
export class GamesDetailResolver implements Resolve < any > {
  constructor(private backend : GamesService) {}
  resolve(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : Observable < any >| Promise < any >| any {
    // console.log('returning resolved games data');
    return this
      .backend
      .getSingleGame(route.params.slug);
  }

}
