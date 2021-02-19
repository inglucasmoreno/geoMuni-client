import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { GeolocalizarComponent } from './geolocalizar/geolocalizar.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EventosComponent } from './eventos/eventos.component';
import { ComponentsModule } from '../components/components.module';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar/editar-password.component';
import { PipesModule } from '../pipes/pipes.module';
import { EventoComponent } from './eventos/evento.component';
import { EditarEventoComponent } from './eventos/editar/editar-evento/editar-evento.component';
import { TiposComponent } from './tipos/tipos.component';
import { EditarTiposComponent } from './tipos/editar/editar-tipos.component';

@NgModule({
  declarations: [
    HomeComponent, 
    PagesComponent, GeolocalizarComponent, UsuariosComponent, EventosComponent, NuevoUsuarioComponent, EditarUsuarioComponent, EditarPasswordComponent, EventoComponent, EditarEventoComponent, TiposComponent, EditarTiposComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    PipesModule
  ]
})
export class PagesModule { }

