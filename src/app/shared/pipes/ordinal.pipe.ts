import { Pipe, PipeTransform } from '@angular/core';

const ordinals: string[] = ['th','st','nd','rd'];

@Pipe({name: 'ordinal'})
export class OrdinalPipe implements PipeTransform {

    transform(n: number) {
        let v = n % 100;
        return n + (ordinals[(v-20)%10]||ordinals[v]||ordinals[0]);
    }
}
