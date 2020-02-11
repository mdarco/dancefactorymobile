import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { TrainingsPage } from './trainings.page';
import { TrainingsFilterComponent } from '../trainings-filter/trainings-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TrainingsPage
      }
    ])
  ],
  declarations: [
    TrainingsPage,
    TrainingsFilterComponent
  ],
  entryComponents: [
    TrainingsFilterComponent
  ]
})
export class TrainingsPageModule {}
