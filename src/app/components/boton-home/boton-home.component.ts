import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boton-home',
  templateUrl: './boton-home.component.html',
  styles: [
  ]
})
export class BotonHomeComponent {

  // Propiedades de entrada
  @Input() icono: string;
  @Input() titulo: string;
  @Input() ruta: string;

  constructor(private router: Router) { }

  navegar = () => {
    this.router.navigateByUrl(this.ruta)
  };
 
}
