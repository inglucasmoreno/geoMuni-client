import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }
  
  async actualizarFoto( archivo: File, tipo: 'eventos'|'usuarios', id: string ) {
    try{
      const url = `${ baseUrl }/uploads/${ tipo }/${ id }`;
      const formData = new FormData();
      formData.append('imagen', archivo);
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      }); 
        
      const data = await resp.json();
      
      if(data.ok){
        return {
          ok: true,
          error: 'No hay error',
        };
      }else{
        return {
          ok: false,
          error: data.msg
        };
      }   
    }catch(error){
      console.log(error);
      return {
        ok: false,
        error: 'Error de servidor'
      };
    }
  }

}
