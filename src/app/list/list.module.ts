import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ListPage } from './list.page';
import { ListFilterComponent } from '../list-filter/list-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListPage
      }
    ])
  ],
  declarations: [
    ListPage,
    ListFilterComponent
  ],
  entryComponents: [
    ListFilterComponent
  ]
})
export class ListPageModule {}
