import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate{

  constructor(private authService: AuthService,
              private router: Router){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>{
    return this.authService.proteccionLogin()
                           .pipe(
                             tap( logueado=> {
                               if (!logueado){ this.router.navigateByUrl('/dashboard/home'); }
                             })
                           );
  }
}
