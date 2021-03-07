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

  // Tipo por ID
  getTipo(id: string): Observable<any>{
    return this.http.get(`${baseUrl}/tipos/${id}`,{
      headers:{'x-token': localStorage.getItem('token')}
    })
  }

  // Nuevo tipo
  nuevoTipo(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/tipos`, data, {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    })
  }

  // Listar tipos
  listarTipos(
    activo = null, 
    descripcion = '' , 
    desde = 0, 
    limit = 0,
    columna: string = 'descripcion',
    direccion: any = 1
    ): Observable<any> {
    return this.http.get(`${baseUrl}/tipos`, { 
      params: { 
        activo: activo ? activo : '',
        desde: String(desde),
        limit: String(limit),
        descripcion,
        columna,
        direccion: String(direccion)
      }, 
      headers: { 'x-token': localStorage.getItem('token') }
    });
  }

  // Actualizar eventos
  actualizarTipo(id: string, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/tipos/${id}`, data, { 
      headers: {
        'x-token': localStorage.getItem('token')  
      }});
  }

}
