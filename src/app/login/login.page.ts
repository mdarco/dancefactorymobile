import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private username: string;
  private password: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authService.login({
      Username: this.username,
      Password: btoa(this.password)
    }).subscribe();
  }

}
