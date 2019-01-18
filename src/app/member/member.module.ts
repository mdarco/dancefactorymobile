import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MemberPage } from './member.page';

const routes: Routes = [
  {
    path: '',
    component: MemberPage,
    children: [
      {
        path: '',
        redirectTo: 'member-general',
        pathMatch: 'full'
      },
      {
        path: 'member-general',
        children: [
          {
            path: '',
            loadChildren: '../member-details/member-details.module#MemberDetailsPageModule'
          }
        ]
      },
      {
        path: 'member-docs',
        children: [
          {
            path: '',
            loadChildren: '../member-docs/member-docs.module#MemberDocsPageModule'
          }
        ]
      },
      {
        path: 'member-payments',
        children: [
          {
            path: '',
            loadChildren: '../member-payments/member-payments.module#MemberPaymentsPageModule'
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MemberPage],
  exports: [RouterModule]
})
export class MemberPageModule {}
