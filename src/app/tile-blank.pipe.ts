import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'tileBlank'})
export class TileBlankPipe implements PipeTransform {

  transform(value : any, args?: any) : any {
    const str = value;
    if (str === '?') {
      return '';
    }
    return str;
  }

}
