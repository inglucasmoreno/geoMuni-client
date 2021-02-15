import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boton-tabla',
  templateUrl: './boton-tabla.component.html',
  styles: [
  ]
})
export class BotonTablaComponent implements OnInit {

  @Input() ruta: string = null;
  @Input() id: string;
  @Input() icono: string;
  @Input() titulo: string;
  @Input() hover: string = 'hover:text-blue-500';
  @Output() completar = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  accion(): void {
    
    // Navegar - Si recibo una ruta
    if(this.ruta){
      const destino = `${this.ruta}/${this.id}` 
      this.router.navigateByUrl(destino);
    }else{ // Sino - Completar tareas
      this.completar.emit();  
    }
  }

}