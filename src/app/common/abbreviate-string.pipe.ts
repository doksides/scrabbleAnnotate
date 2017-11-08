import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'abbreviateString'})
export class AbbreviateStringPipe implements PipeTransform {

  transform(value : any, args?: any) : any {
    const str = value;
    const res = str.split(' ');
    if (res.length > 1) {
      let abb = res[0].charAt(0);
      abb = abb + '. ';
      const end = res.slice(-1);
      return abb.concat(end);
    }
    return null;
  }

}
