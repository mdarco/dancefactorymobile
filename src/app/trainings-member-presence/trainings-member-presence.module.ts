import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TrainingsMemberPresencePage } from './trainings-member-presence.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingsMemberPresencePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TrainingsMemberPresencePage]
})
export class TrainingsMemberPresencePageModule {}
