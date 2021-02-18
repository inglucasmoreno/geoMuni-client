import { Component, OnInit } from '@angular/core';
import { Tipo } from 'src/app/models/tipo,model';
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
  public total = 0;
  public tipos: Tipo[];

  constructor(private tiposService: TiposService) { }

  ngOnInit(): void { 
    this.actualizarLista();
  }

  actualizarLista(): void {
    this.loading = true;
    this.tiposService.listarTipos().subscribe( ({ tipos, total }) => {
      this.total = total;
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
      this.tiposService.actualizarEventos(tipo._id, { activo: !tipo.activo }).subscribe( () => {
        if (result.isConfirmed) {
          this.loading = true;
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'El tipo ha sido actualizado',
            showConfirmButton: false,
            timer: 1000
          })
          this.actualizarLista();
        }
      });
    })
  }

}
