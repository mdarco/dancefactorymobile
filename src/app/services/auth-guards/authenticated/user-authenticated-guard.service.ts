import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticatedGuardService implements CanActivate {

  constructor(private authService: AuthService) { }

  canActivate(): boolean {
    return this.authService.isAuthenticated();
  }
}
