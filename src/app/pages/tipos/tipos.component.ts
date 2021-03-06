import { Component, OnInit } from '@angular/core';
import { Tipo } from 'src/app/models/tipo.model';
import { TiposService } from 'src/app/services/tipos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipos',
  templateUrl: './tipos.component.html',
  styles: [
  ]
})
export class TiposComponent implements OnInit {

  public loading = true;
  public tipos: Tipo[];

  // Filtrado
  public filtrado = { activo: true, descripcion: '' };

  // Paginacion
  public paginacion = { limit: 5, desde: 0, hasta: 5, total: 0 };

  // Ordenar
  public ordenar = { columna: 'descripcion', direccion: 1 };

  constructor(private tiposService: TiposService) { }

  ngOnInit(): void { 
    this.actualizarLista();
  }

  actualizarLista(): void {
    this.loading = true;
    this.tiposService.listarTipos(
      this.filtrado.activo, 
      this.filtrado.descripcion, 
      this.paginacion.desde,
      this.paginacion.hasta,
      this.ordenar.columna,
      this.ordenar.direccion
    ).subscribe( ({ tipos, total }) => {
      this.paginacion.total = total;
      this.tipos = tipos;
      this.loading = false;
    });
  }

  nuevoTipo(descripcionCtrl: any): void {
    if(descripcionCtrl.value.trim() === ''){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'La descripción es obligatoria',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    this.tiposService.nuevoTipo({descripcion: descripcionCtrl.value}).subscribe(() => {
      this.loading = true;
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'Nuevo tipo creado',
        confirmButtonText: 'Entendido'
      });
      descripcionCtrl.value = '';
      this.actualizarLista();
    }, ({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
    });
  }

  actualizarEstado(tipo: any): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Estas por actualizar el estado de un tipo",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed){
        this.tiposService.actualizarTipo(tipo._id, { activo: !tipo.activo }).subscribe( () => {   
          this.loading = true;
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'El tipo ha sido actualizado',
            showConfirmButton: false,
            timer: 1000
          })
          this.actualizarLista();
        },({error}) => {
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
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
    this.actualizarLista();
  }


  filtroActivo(activo: boolean): void {
    this.loading = true;
    this.reiniciarPaginacion();
    this.filtrado.activo = activo;
    this.actualizarLista();
  }

  filtroDescripcion(descripcion: string): void {
    this.loading = true;
    this.reiniciarPaginacion();
    this.filtrado.descripcion = descripcion;
    this.actualizarLista();
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.loading = true;
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.actualizarLista();  
  }

  reiniciarPaginacion() {
    this.paginacion.total = 0;
    this.paginacion.limit = 5;
    this.paginacion.desde = 0;
    this.paginacion.hasta = 5;    
  }

}
