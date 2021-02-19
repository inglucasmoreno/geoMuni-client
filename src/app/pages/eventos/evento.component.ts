import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Evento } from 'src/app/models/evento.model';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { EventosService } from '../../services/eventos.service';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styles: [
  ]
})
export class EventoComponent implements OnInit {

  public evento: Evento;
  public loading = true;
  public usuarioLogin: Usuario;

  constructor(private activatedRoute: ActivatedRoute,
              private eventosService: EventosService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario;
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.getEvento(id);
    }) 
  }

  getEvento(id: string): void {
    this.eventosService.getEvento(id).subscribe( ({ evento }) => {  
      console.log(evento);
      this.evento = evento;
      this.loading = false;
    });      
  }

}
