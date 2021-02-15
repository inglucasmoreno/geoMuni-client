import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-editar-password',
  templateUrl: './editar-password.component.html',
  styles: [
  ]
})
export class EditarPasswordComponent implements OnInit {

  public id: string;
  public usuario: Usuario = {
    uid: '',
    dni: '',
    apellido: '',
    nombre: '',
    email: '',
  };
  public passwordForm = this.fb.group({
    password: ['', Validators.required],
    repetir: ['', Validators.required]
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id}) => {
      this.id = id;
      this.usuariosService.getUsuario(id).subscribe( usuario => {
        this.usuario = usuario;
      });
    });
  }

  regresar(): void{
    this.router.navigateByUrl('/dashboard/usuarios');
  }

  actualizarPassword(): void | boolean{
    const {password, repetir} = this.passwordForm.value;

    if (password.trim() === '' || repetir.trim() === ''){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debes completar todos los campos',
        confirmButtonText: 'Entendido'
      });
      return false;
    }

    if (password !== repetir){
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Las contraseñas deben coincidir',
        confirmButtonText: 'Entendido'
      });
      return false;
    }

    this.usuario.password = password;
    this.usuariosService.actualizarUsuario(this.id, this.usuario).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'Contraseña actualizada!',
        showConfirmButton: false,
        timer: 1000
      });
      this.router.navigateByUrl('/dashboard/usuarios');
    }, ({error}) => {
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
    });

  }

}
