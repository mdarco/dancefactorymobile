import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';

import { DanceGroupsService } from '../services/dance-groups/dance-groups.service';

@Component({
  selector: 'app-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss']
})
export class ListFilterComponent implements OnInit, OnDestroy {
  danceGroups: any = [];
  modalData = {};

  private danceGroups$: any;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private danceGroupsService: DanceGroupsService
  ) { }

  ngOnInit() {
    this.getDanceGroups();
  }

  ngOnDestroy() {
    this.danceGroups$.unsubscribe();
  }

  async getDanceGroups() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Učitavanje grupa u toku..'
    });

    await loading.present();

    this.danceGroups$ = this.danceGroupsService.getLookup().subscribe(
      response => {
        console.log('DANCE GROUPS RESPONSE', response);
        if (response && response['length'] > 0) {
          this.danceGroups = response;
        }
      },
      error => {
        console.log('DANCE GROUPS LOOKUP ERROR', error);
        this.danceGroups = [];
        this.showToast('Došlo je do greške prilikom preuzimanja spiska plesnih grupa.', 'danger');
      },
      () => {
        loading.dismiss();
      }
    );
  }

  removeStatusSelection() {
    this.modalData['Status'] = undefined;
  }

  removeDanceGroupSelection() {
    this.modalData['DanceGroupID'] = undefined;
  }

  async showToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }

  applyFilter() {
    this.modalController.dismiss({
      filterData: this.modalData
    });
  }

  cancel() {
    this.modalController.dismiss();
  }
}
