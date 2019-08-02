import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {LocalStorageService} from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private localSessionStorage: LocalStorageService,
    public router: Router
  ) {}
  canActivate() {
    if (this.localSessionStorage.get('appkey')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
