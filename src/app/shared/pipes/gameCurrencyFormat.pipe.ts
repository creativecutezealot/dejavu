import { PipeTransform, Pipe } from '@angular/core';
import { Bets } from 'src/app/models/gameboard/bets.model';

@Pipe({
    name:'gameCurrencyFormat',
    pure:false
})
export class GameCurrencyFormatPipe implements PipeTransform{
    transform(value: number, args?:any): any{
       
      if (Number.isNaN(value)) {
        return null;
      }

      if (value < 1000) {
        return value.toFixed(2);
      }

      if(value < 1000000){
        // return this.format((value/1000))+"k";
        return Number((value).toFixed(2)).toLocaleString();
      }

      if(value < 1000000000){
        return this.format((value/1000000))+"M";
      }
   
      if(value < 1000000000000){
        return this.format(value/1000000000)+"B";
      }
      
      return "";
     }

    format(num){
        var num_arr = String(num).split(".");
        var dec = num_arr[1];
        var wh = num_arr[0];
        if(!dec){
            return wh;
        }
        dec = String(dec).substr(0,2);
        if(dec=="00"){
            return wh;
        }
     
        return wh+"."+dec;
    }
}