import { PipeTransform, Pipe } from '@angular/core';
import { Bets } from 'src/app/models/gameboard/bets.model';

@Pipe({
  name: 'betsfilter',
  pure: false
})
export class BetsFilterPipe implements PipeTransform {
  transform(value: Bets[], filter: string): any {
    if (value.length === 0 || filter == '') {
      return value;
    }
    let bets = [];
    for (const item of value) {
      if (item.place == filter) {
        bets.push(item);
      }
    }

    return bets;
  }
}
