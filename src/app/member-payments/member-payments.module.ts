import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MemberPaymentsPage } from './member-payments.page';
import { InstallmentsComponent } from '../installments/installments.component';

const routes: Routes = [
  {
    path: '',
    component: MemberPaymentsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    MemberPaymentsPage, 
    InstallmentsComponent
  ],
  entryComponents: [
    InstallmentsComponent
  ]
})
export class MemberPaymentsPageModule {}
