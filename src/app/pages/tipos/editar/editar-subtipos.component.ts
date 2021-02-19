import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubtiposService } from 'src/app/services/subtipos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-subtipos',
  templateUrl: './editar-subtipos.component.html'
})
export class EditarSubtiposComponent implements OnInit {

  public loading = false;
  public subtipo;

  public formSubtipo = this.fb.group({
    descripcion: ['', Validators.required],  
    activo: [true, Validators.required]
  });

  constructor(private fb: FormBuilder,
              private subtiposService: SubtiposService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => {this.getSubtipo(id)} );  
  }

  getSubtipo(id: string): void {
    this.subtiposService.getSubtipo(id).subscribe( ({subtipo}) => {
      this.subtipo = subtipo;
      this.formSubtipo.setValue({
         descripcion: subtipo.descripcion,
         activo: subtipo.activo 
      })
    });
  }

  actualizarSubtipo(): void {
    if(this.formSubtipo.status === 'INVALID'){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'debe rellenar todos los campos',
        confirmButtonText: 'Entendido'
      })
      return;
    }
    this.subtiposService.actualizarSubtipo(this.subtipo._id, this.formSubtipo.value).subscribe(()=>{
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'El tipo ha sido actualizado',
        showConfirmButton: false,
        timer: 1000
      });
      this.router.navigateByUrl(`dashboard/tipos/subtipos/${this.subtipo.tipo}`);
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
