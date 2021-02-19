import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Tipo } from 'src/app/models/tipo.model';
import Swal from 'sweetalert2';
import { TiposService } from '../../../services/tipos.service';

@Component({
  selector: 'app-editar-tipos',
  templateUrl: './editar-tipos.component.html',
  styles: [
  ]
})
export class EditarTiposComponent implements OnInit {

  public loading = false;
  public tipo: Tipo;

  public formTipo = this.fb.group({
    descripcion: ['', Validators.required],  
    activo: [true, Validators.required]
  });

  constructor(private fb: FormBuilder,
              private tiposService: TiposService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => (this.getTipo(id)) );  
  }

  getTipo(id: string): void {
    this.tiposService.getTipo(id).subscribe( ({tipo}) => {
      this.tipo = tipo;
      this.formTipo.setValue({
         descripcion: tipo.descripcion,
         activo: tipo.activo 
      })
    });
  }

  actualizarTipo(): void {
    if(this.formTipo.status === 'INVALID'){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'debe rellenar todos los campos',
        confirmButtonText: 'Entendido'
      })
      return;
    }
    this.tiposService.actualizarTipo(this.tipo._id, this.formTipo.value).subscribe(()=>{
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'El tipo ha sido actualizado',
        showConfirmButton: false,
        timer: 1000
      });
      this.router.navigateByUrl('dashboard/tipos');
    },({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      })
    });
  }

}
