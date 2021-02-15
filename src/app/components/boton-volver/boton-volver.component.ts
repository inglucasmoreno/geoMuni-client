import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boton-volver',
  templateUrl: './boton-volver.component.html',
  styles: [
  ]
})
export class BotonVolverComponent implements OnInit {

  @Input() ruta: string;
  @Input() id: string = null;

  constructor(private router: Router) { }

  ngOnInit(): void {}

  navegar(): void {
    let destino: string;
    this.id ? destino = `${this.ruta}/${this.id}` : destino = this.ruta; 
    this.router.navigateByUrl(destino);
  }

}