import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserAuthenticatedGuardService } from './services/auth-guards/authenticated/user-authenticated-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule',
    canActivate: [UserAuthenticatedGuardService]
  },
  {
    path: 'list/:id',
    loadChildren: './member/member.module#MemberPageModule',
    canActivate: [UserAuthenticatedGuardService]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    IonicModule,
    CommonModule,
    FormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
