import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonHomeComponent } from './boton-home/boton-home.component';
import { BotonVolverComponent } from './boton-volver/boton-volver.component';
import { PastillaComponent } from './pastilla/pastilla.component';
import { TarjetaComponent } from './tarjeta/tarjeta.component';
import { BotonTablaComponent } from './boton-tabla/boton-tabla.component';
import { BotonEstadoComponent } from './boton-estado/boton-estado.component';
import { BotonRealizarComponent } from './boton-realizar/boton-realizar.component';

@NgModule({
  declarations: [
    BotonHomeComponent,
    BotonVolverComponent,
    PastillaComponent,
    TarjetaComponent,
    BotonTablaComponent,
    BotonEstadoComponent,
    BotonRealizarComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BotonHomeComponent,
    BotonVolverComponent,
    PastillaComponent,
    TarjetaComponent,
    BotonTablaComponent,
    BotonEstadoComponent,
    BotonRealizarComponent
  ]
})
export class ComponentsModule { }
