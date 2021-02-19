import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { SubtiposService } from '../../services/subtipos.service';
import { TiposService } from '../../services/tipos.service';

@Component({
  selector: 'app-subtipos',
  templateUrl: './subtipos.component.html',
  styles: [
  ]
})
export class SubtiposComponent implements OnInit {

  public idTipo;
  public tipo;
  public loading = true;
  public subtipos;
  public total = 0;

  // Filtrado
  public filtrado = { activo: true, descripcion: '' };

  // Paginacion
  public paginacion = { limit: 5, desde: 0, hasta: 5 };

  constructor(private activatedRoute: ActivatedRoute,
              private subtiposService: SubtiposService,
              private tiposService: TiposService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id}) => {
      this.idTipo = id;
      this.getTipo();
      this.listarSubtipos();
    });
  }

  getTipo(): void {
    this.loading = true;
    this.tiposService.getTipo(this.idTipo).subscribe(({tipo})=>{
      this.tipo = tipo;
      this.loading = false;
    })
  }

  listarSubtipos(): void {
    this.loading = true;
    this.subtiposService.listarSubtipos(
      this.idTipo,
      this.filtrado.activo, 
      this.filtrado.descripcion, 
      this.paginacion.desde,
      this.paginacion.hasta
      ).subscribe(({subtipos, total}) => {
      this.total = total;
      this.subtipos = subtipos;
      this.loading = false;
    });
  }

  nuevoSubtipo(subtipoCtrl: any): void {
      if(subtipoCtrl.value.trim() === ''){
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'Debe rellenar todos los campos',
          confirmButtonText: 'Entendido'
        })
        return;
      }
      
      this.subtiposService.nuevoSubtipo({
        tipo: this.idTipo, 
        descripcion: subtipoCtrl.value
      }).subscribe(()=>{
        Swal.fire({
          icon: 'success',
          title: 'Completado',
          text: 'El subtipo ha sido creado',
          confirmButtonText: 'Entendido'
        });
        this.listarSubtipos();
      },({error})=>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.msg,
          confirmButtonText: 'Entendido'
        })
      });

      subtipoCtrl.value = '';
  }

  // Actualizar paginacion
  actualizarDesdeHasta(selector): void {

    this.loading = true;

    if (selector === 'siguiente'){ // Incrementar
      if (this.paginacion.hasta < this.total){
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
    this.listarSubtipos();
  }

  // Actualizar estado de subtipo
  actualizarEstado(subtipo: any): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Estas por actualizar el estado de un subtipo",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      this.subtiposService.actualizarSubtipo(subtipo._id, {tipo: this.idTipo, activo: !subtipo.activo}).subscribe( () => {
        if (result.isConfirmed) {
          this.loading = true;
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'El tipo ha sido actualizado',
            showConfirmButton: false,
            timer: 1000
          })
          this.listarSubtipos();
        }
      });
    })
  }

  filtroActivo(activo: boolean): void {
    this.loading = true;
    this.filtrado.activo = activo;
    this.listarSubtipos();
  }

  filtroDescripcion(descripcion: string): void {
    this.loading = true;
    this.filtrado.descripcion = descripcion;
    this.listarSubtipos();
  }

}
