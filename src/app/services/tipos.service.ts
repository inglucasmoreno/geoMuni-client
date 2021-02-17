import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TiposService {
  
  constructor(private http: HttpClient) { }
  
  // Listar tipos
  listarTipos(activo = null): Observable<any> {

    return this.http.get(`${baseUrl}/tipos`, { 
      params: { 
        activo: activo ? activo : ''
      }, 
      headers: { 'x-token': localStorage.getItem('token') }
    });
  }
  
}
