import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from 'src/app/models/evento.model';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { EventosService } from 'src/app/services/eventos.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TiposService } from '../../../../services/tipos.service';
import { Tipo } from '../../../../models/tipo.model';
import Swal from 'sweetalert2';
import { SubtiposService } from '../../../../services/subtipos.service';

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html',
  styles: [
  ]
})
export class EditarEventoComponent implements OnInit {

  public evento: Evento;
  public loading = true;
  public usuarioLogin: Usuario;
  public tipos: Tipo[];
  public subtipos = [];

  public eventoForm = this.fb.group({
    descripcion: ['', Validators.required],
    tipo: ['', Validators.required],
    subtipo: ['', Validators.required]
  });

  constructor(private activatedRoute: ActivatedRoute,
              private tiposService: TiposService,
              private subtiposService: SubtiposService, 
              private eventosService: EventosService,
              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router) {}

  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario;
    this.listarTipos();
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.getEvento(id);
    }) 
  }

  listarSubtipos(idEvento: string): void {
    this.subtiposService.listarSubtipos(idEvento, true).subscribe( ({subtipos}) => {
      if(subtipos) this.subtipos = subtipos;
      this.eventoForm.setValue({
        descripcion: this.eventoForm.value.descripcion,
        tipo: this.eventoForm.value.tipo,
        subtipo: subtipos[0]._id  
      });
    })
  }

  subtiposIniciales(idEvento: string): void {
    this.subtiposService.listarSubtipos(idEvento, true).subscribe( ({subtipos}) => {
      if(subtipos) this.subtipos = subtipos;
    })
  }

  listarTipos(): void {
    this.tiposService.listarTipos().subscribe(({ tipos }) => {
      this.tipos = tipos;
    });
  }

  getEvento(id: string): void {
    this.eventosService.getEvento(id).subscribe( ({ evento }) => {  
      this.evento = evento;
      this.valoresIniciales(evento);
      this.loading = false;
    });      
  }

  valoresIniciales(evento: Evento): void {
    this.eventoForm.setValue({
      descripcion: evento.descripcion,
      tipo: evento.tipo['_id'],
      subtipo: evento.subtipo ? evento.subtipo._id : ''   
    });
    this.subtiposIniciales(evento.tipo._id);
  }

  actualizarEvento(): void{
    if(this.eventoForm.status === 'INVALID'){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debe rellenar todos los campos',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    
    // Actualizando evento
    this.eventosService.actualizarEvento(this.evento._id, this.eventoForm.value).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'Evento actualizado',
        showConfirmButton: false,
        timer: 1000
      }) 
      this.router.navigateByUrl('/dashboard/eventos'); 
    })

  }

}
