import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private username: string;
  private password: string;

  private loginSubscription: any;

  constructor(private authService: AuthService, private loadingController: LoadingController) { }

  ngOnInit() { }

  async login() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Prijava u toku...'
    });

    await loading.present();

    this.loginSubscription = this.authService.login({
      Username: this.username,
      Password: btoa(this.password)
    }).subscribe(result => {}, error => {}, () => {
      this.username = undefined;
      this.password = undefined;
      loading.dismiss();
    });
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

}
