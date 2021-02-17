import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
import { CursorComponent } from './cursor/cursor.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LoaderComponent,
    CursorComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    LoaderComponent,
    CursorComponent  
  ]
})
export class SharedModule { }
