import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class EmitterService {
  private static _emitters : {
    [currentPage : number]: EventEmitter < any >
  } = {};

  static get(currentPage : number) : EventEmitter < any > {
    if(!this._emitters[currentPage]) {
      this._emitters[currentPage] = new EventEmitter();
    }
    return this._emitters[currentPage];
  }
}
