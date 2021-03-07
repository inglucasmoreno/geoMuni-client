import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  constructor( private http: HttpClient ) { }
  
  // Crear nuevo evento
  nuevoEvento(data: Evento): Observable<any> {
    return this.http.post(`${baseUrl}/eventos`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    })
  }

  // Evento por ID
  getEvento(id: string): Observable<any> {
    return this.http.get(`${baseUrl}/eventos/${id}`,{
      headers: { 'x-token': localStorage.getItem('token') }
    });
  }

  // Listar eventos
  listarEventos(
    activo = null, 
    desde = 0, 
    limit = 0, 
    descripcion = '', 
    tipo = '',
    columna = 'createdAt',
    direccion = -1
  ): Observable<any> {
    return this.http.get(`${baseUrl}/eventos`, {
      params: {
        activo: activo ? activo : '',
        desde: String(desde),
        limit: String(limit),
        descripcion,
        tipo,
        columna,
        direccion: String(direccion)
      },
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

  // Actualizar evento
  actualizarEvento(id, data): Observable<any> {
    return this.http.put(`${baseUrl}/eventos/${id}`, data, {
      headers: {'x-token': localStorage.getItem('token')}
    });
  }

  // Eliminar evento
  eliminarEvento(id): Observable<any> {
    return this.http.delete(`${baseUrl}/eventos/${id}`, {
      headers: {'x-token': localStorage.getItem('token')}
    });
  }

}
