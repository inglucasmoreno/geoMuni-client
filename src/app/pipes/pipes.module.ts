import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { ImagenPipe } from './imagen.pipe';



@NgModule({
  declarations: [
    FechaPipe,
    ImagenPipe
  ],
  imports: [
    CommonModule,

  ],exports: [
    FechaPipe,
    ImagenPipe
  ]
})
export class PipesModule { }
