import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { JwtHelperService } from '@auth0/angular-jwt';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'df_access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  userModel = null;

  authenticationState = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private storage: Storage,
    private alertController: AlertController
  ) { }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        const isExpired = this.jwtHelper.isTokenExpired(token);

        if (!isExpired) {
          // this.authenticationState.next(true);
        } else {
          this.logout();
        }
      }
    });
  }

  login(credentials) {
    return this.http.post(`${this.apiUrl}/api/login`, credentials)
      .pipe(
        tap(response => {
          // console.log('Login service response', response);
          if (response['IsAuthenticated']) {
            this.storage.set(TOKEN_KEY, response['Token']);
            this.userModel = response;
            this.authenticationState.next(true);
          } else {
            throw new Error('Korisničko ime i/ili lozinka nisu ispravni.');
          }
        }),
        catchError(e => {
          throw new Error('Korisničko ime i/ili lozinka nisu ispravni.');
        })
      );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  setAuthState(newState: boolean) {
    this.authenticationState.next(newState);
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  showAlert(msg: string) {
    const alert = this.alertController.create({
      message: msg,
      header: 'Greška',
      buttons: ['OK']
    });
    alert.then(a => a.present());
  }
}
