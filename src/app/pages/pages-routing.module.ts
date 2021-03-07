import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
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
import { SubtiposComponent } from './tipos/subtipos.component';
import { EditarSubtiposComponent } from './tipos/editar/editar-subtipos.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home' ,component: HomeComponent },
      { path: 'geolocalizar' ,component: GeolocalizarComponent },
      { path: 'eventos/ver/:id' ,component: EventoComponent },
      { path: 'eventos' ,component: EventosComponent },
      { path: 'eventos/editar/:id', canActivate: [AdminGuard] ,component: EditarEventoComponent },
      { path: 'usuarios', canActivate: [AdminGuard] ,component: UsuariosComponent },
      { path: 'usuarios/nuevo', canActivate: [AdminGuard] ,component: NuevoUsuarioComponent },
      { path: 'usuarios/editar/:id', canActivate: [AdminGuard] ,component: EditarUsuarioComponent },
      { path: 'usuarios/password/:id', canActivate: [AdminGuard] ,component: EditarPasswordComponent },
      { path: 'tipos', canActivate: [AdminGuard] ,component: TiposComponent },
      { path: 'tipos/editar/:id', canActivate: [AdminGuard] ,component: EditarTiposComponent },
      { path: 'tipos/editar-subtipos/:id', canActivate: [AdminGuard] ,component: EditarSubtiposComponent },
      { path: 'tipos/subtipos/:id', canActivate: [AdminGuard] ,component: SubtiposComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
