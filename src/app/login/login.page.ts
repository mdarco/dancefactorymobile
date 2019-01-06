import { Component, OnInit } from '@angular/core';
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

  constructor(private authService: AuthService, private loadingController: LoadingController) { }

  ngOnInit() {
  }

  async login() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Prijava u toku...'
    });

    await loading.present();

    this.authService.login({
      Username: this.username,
      Password: btoa(this.password)
    }).subscribe(result => {}, error => {}, () => {
      loading.dismiss();
    });
  }

}
