import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  private username: string;
  private password: string;

  private login$: any;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.login$.unsubscribe();
  }

  async login() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Prijava u toku...'
    });

    await loading.present();

    this.login$ = this.authService.login({
      Username: this.username,
      Password: btoa(this.password)
    }).subscribe(
      result => {},
      error => {
        // console.log('LOGIN ERROR', error);
        loading.dismiss();
        this.username = undefined;
        this.password = undefined;
        this.showAlert(error.message);
      }, 
      () => {
        // console.log('LOGIN FINALLY');
        loading.dismiss();
        this.username = undefined;
        this.password = undefined;
    });
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
