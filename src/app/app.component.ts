import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, MenuController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  hideMenu = true;

  public appPages = [
    {
      title: 'Plesači',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuController: MenuController,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authService.checkToken();

      this.authService.authenticationState.subscribe(state => {
        this.hideMenu = !this.authService.isAuthenticated();
        if (state) {
          this.router.navigate(['list']);
        } else {
          this.router.navigate(['login']);
        }
      });

      // this event fires when the native platform pulls the app
      // from the background - it is fired only with the Cordova apps,
      // it wouldn't fire on a standard web browser
      this.platform.resume.subscribe(result => {
        this.authService.checkToken();
      });
    });
  }

  logout() {
    this.authService.logout();
    this.menuController.close();
  }
}
