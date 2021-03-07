import { Component, OnInit } from '@angular/core';
import { TiposService } from '../../services/tipos.service';
import Swal from 'sweetalert2';
import { Tipo } from '../../models/tipo.model';
import { EventosService } from '../../services/eventos.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styles: [
  ]
})
export class EventosComponent implements OnInit {

  public tipos: Tipo;
  public eventos;
  public loading = true;
  public descripcion = '';
  public tipo = '';
  public activo = true;
  public ordenar = {
    columna: 'createdAt',
    direccion: -1,
  }

  // Paginacion
  public paginacion = { limit: 10, desde: 0, hasta: 10 , total: 0 }

  ngOnInit() {
    this.listarTipos();
    this.listarEventos();
  }

  constructor(private tipoService: TiposService,
              private eventosServices: EventosService) {}
  
  // Listar tipo de eventos
  listarTipos(): void {
    this.tipoService.listarTipos(true).subscribe( ({tipos}) => {
      this.tipos = tipos;
    });
  }

  // Listar eventos
  listarEventos(): void {
    this.loading = true;
    this.eventosServices.listarEventos(
      this.activo, 
      this.paginacion.desde, 
      this.paginacion.hasta, 
      this.descripcion, 
      this.tipo, 
      this.ordenar.columna,
      this.ordenar.direccion
    ).subscribe( ({eventos, total}) => {
      this.paginacion.total = total;
      this.eventos = eventos;
      this.loading = false;
    });    
  }

  // Completar evento
  completarEvento(id: string): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Estas por completar un evento",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Completar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.eventosServices.actualizarEvento(id, { activo: false }).subscribe( resp => {
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'El evento ha sido completado',
            confirmButtonText: 'Entendido',
          });
          this.listarEventos();
        });
      }
    })
  }

  // Actualizar paginacion
  actualizarDesdeHasta(selector): void {

    this.loading = true;

    if (selector === 'siguiente'){ // Incrementar
      if (this.paginacion.hasta < this.paginacion.total){
        this.paginacion.desde += this.paginacion.limit;
        this.paginacion.hasta += this.paginacion.limit;
      }
    }else{                         // Decrementar
      this.paginacion.desde -= this.paginacion.limit;
      if (this.paginacion.desde < 0){
        this.paginacion.desde = 0;
      }else{
        this.paginacion.hasta -= this.paginacion.limit;
      }
    }

    this.listarEventos();
  
  }

  // Filtrado por descripcion
  filtroDescripcion(descripcion: string): void{
    this.loading = true;
    this.reiniciarPaginacion();
    this.descripcion = descripcion;
    this.listarEventos();
  }

  // Filtrado por completada/No completada
  filtroActivo(activo: any): void {
    this.loading = true;
    this.reiniciarPaginacion();
    this.activo = activo;
    this.listarEventos();
  }

  // Filtrado por tipo
  filtrarTipo(txtTipo: string): void {
    this.loading = true;
    this.reiniciarPaginacion();
    this.tipo = txtTipo;
    this.listarEventos();
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.loading = true;
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarEventos();  
  }
  
  // Reiniciar paginacion
  reiniciarPaginacion() {
    this.paginacion.total = 0;
    this.paginacion.limit = 10;
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;    
  }

  

  

}
