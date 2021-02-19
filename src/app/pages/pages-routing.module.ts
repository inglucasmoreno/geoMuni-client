import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../guards/auth.guard';
import { GeolocalizarComponent } from './geolocalizar/geolocalizar.component';
import { EventosComponent } from './eventos/eventos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar/editar-password.component';
import { AdminGuard } from '../guards/admin.guard';
import { EventoComponent } from './eventos/evento.component';
import { EditarEventoComponent } from './eventos/editar/editar-evento/editar-evento.component';
import { TiposComponent } from './tipos/tipos.component';
import { EditarTiposComponent } from './tipos/editar/editar-tipos.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', canActivate: [AuthGuard] ,component: HomeComponent },
      { path: 'geolocalizar', canActivate: [AuthGuard] ,component: GeolocalizarComponent },
      { path: 'eventos/ver/:id', canActivate: [AuthGuard] ,component: EventoComponent },
      { path: 'eventos', canActivate: [AuthGuard] ,component: EventosComponent },
      { path: 'eventos/editar/:id', canActivate: [AuthGuard, AdminGuard] ,component: EditarEventoComponent },
      { path: 'usuarios', canActivate: [AuthGuard, AdminGuard] ,component: UsuariosComponent },
      { path: 'usuarios/nuevo', canActivate: [AuthGuard, AdminGuard] ,component: NuevoUsuarioComponent },
      { path: 'usuarios/editar/:id', canActivate: [AuthGuard, AdminGuard] ,component: EditarUsuarioComponent },
      { path: 'usuarios/password/:id', canActivate: [AuthGuard, AdminGuard] ,component: EditarPasswordComponent },
      { path: 'tipos', canActivate: [AuthGuard, AdminGuard] ,component: TiposComponent },
      { path: 'tipos/editar/:id', canActivate: [AuthGuard, AdminGuard] ,component: EditarTiposComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
