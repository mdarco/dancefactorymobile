import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserAuthenticatedGuardService } from './services/auth-guards/authenticated/user-authenticated-guard.service';
import { LoginPage } from './login/login.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [UserAuthenticatedGuardService]
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule',
    canActivate: [UserAuthenticatedGuardService]
  },
  { 
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule' 
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    IonicModule,
    CommonModule,
    FormsModule
  ],
  exports: [RouterModule],
  declarations: [
    LoginPage
  ]
})
export class AppRoutingModule {}
