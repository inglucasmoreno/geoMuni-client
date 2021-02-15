import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pastilla',
  templateUrl: './pastilla.component.html',
  styles: [
  ]
})
export class PastillaComponent implements OnInit {

  @Input() texto: string;
  @Input() color: string = 'bg-blue-500';
  @Input() icono: string;

  constructor() { }

  ngOnInit(): void {
  }

}
