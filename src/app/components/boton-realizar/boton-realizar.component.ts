import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-boton-realizar',
  templateUrl: './boton-realizar.component.html',
  styles: [
  ]
})
export class BotonRealizarComponent implements OnInit {

  @Input() loading: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
