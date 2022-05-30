import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanLoad {

  constructor(private usuarioService: UsuarioService){}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean { // true admin
      return this.usuarioService.comprobarRol();
  }
  
}
