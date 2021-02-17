import { Pipe, PipeTransform } from '@angular/core';
import * as momento from 'moment';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(fecha: Date): string {
    return momento(fecha).format('DD/MM/YYYY');
  }

}
