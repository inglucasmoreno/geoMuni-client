import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-boton-estado',
  templateUrl: './boton-estado.component.html',
  styles: [
  ]
})
export class BotonEstadoComponent implements OnInit {

  constructor() { }

  @Input() activo: boolean = true;

  ngOnInit(): void {
  }

}
