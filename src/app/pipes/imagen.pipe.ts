import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {
  transform(img: string, tipo: 'eventos'|'usuarios'): unknown {
    if(!img){ 
      return `${baseUrl}/uploads/sin-foto.png`;
    }else{
      return `${baseUrl}/uploads/${ tipo }/${ img }`;
    }
  }
}
