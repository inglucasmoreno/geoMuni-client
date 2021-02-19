import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SubtiposService {

  constructor(private http: HttpClient) { }
  
  // Subtipo por ID
  getSubtipo(id: string): Observable<any> {
    return this.http.get(`${baseUrl}/subtipos/${id}`, {headers: {
      'x-token': localStorage.getItem('token')
    }});
  }

  // Nuevo subtipo
  nuevoSubtipo(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/subtipos`, data, {headers: {
      'x-token': localStorage.getItem('token')
    }});
  }

  // Listar subtipos
  listarSubtipos(idTipo: string, activo = null, descripcion = '' , desde = 0, limit = 0): Observable<any> {
    return this.http.get(`${baseUrl}/subtipos/listar/${idTipo}`,{
      params: {
        activo: activo ? activo : '',
        desde: String(desde),
        limit: String(limit),
        descripcion
      },
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // ActualizarSubtipo
  actualizarSubtipo(id: string, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/subtipos/${id}`, data,{
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

}
