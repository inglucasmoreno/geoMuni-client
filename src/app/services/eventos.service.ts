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

  // Listar eventos
  listarEventos(): Observable<any> {
    return this.http.get(`${baseUrl}/eventos`, {
      headers: {'x-token': localStorage.getItem('token')}
    })
  }

}
