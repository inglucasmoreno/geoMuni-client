import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  public usuarios: Usuario[];

  public paginacion = { total: 0, limit: 10, desde: 0, hasta: 10 };
  public ordenar = { columna: 'apellido', direccion: 1 };

  public filtroActivo = true;
  public filtroDni = '';
  public loading = true;

  // Para reportes
  public totalReporte = 0;
  public usuariosReporte = [];

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.usuariosService.listarUsuarios(
      this.paginacion.limit, 
      this.paginacion.desde, 
      this.filtroActivo, 
      this.filtroDni,
      this.ordenar.columna,
      this.ordenar.direccion
    ).subscribe( resp => {
      const { usuarios, total } = resp;
      this.usuarios = usuarios;
      this.paginacion.total = total;
      this.loading = false;
    }, (({error}) => {
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
    }));
  }

  actualizarEstado(usuario: Usuario): void {
    const { uid, activo } = usuario;
    Swal.fire({
      title: '¿Estas seguro?',
      text: `¿Quieres actualizar el estado de ${usuario.nombre}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;  
        this.usuariosService.actualizarUsuario(uid, {activo: !activo}).subscribe(resp => {
          this.listarUsuarios();
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: `Has actualizado el estado de ${usuario.nombre}`,
            showConfirmButton: false,
            timer: 1000
          });
        }, ({error}) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
        });
      }
    });

  }

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

    this.listarUsuarios();

  }

  filtrarActivos(activo: any): void{
    this.loading = true;
    this.filtroActivo = activo;
    this.reiniciarPaginacion();
    this.listarUsuarios();
  }

  filtrarDni(dni: string): void{
    this.loading = true;
    this.filtroDni = dni;
    this.reiniciarPaginacion;
    this.listarUsuarios();
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.loading = true;
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.listarUsuarios();  
  }

  reiniciarPaginacion() {
    this.paginacion.total = 0;
    this.paginacion.limit = 10;
    this.paginacion.desde = 0;
    this.paginacion.hasta = 10;    
  }

}
