import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  public usuario: Usuario;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.usuario = this.authService.usuario;
  }

}
