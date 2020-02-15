import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';

import { AuthService } from '../services/auth/auth.service';
import { DanceGroupsService } from '../services/dance-groups/dance-groups.service';

@Component({
  selector: 'app-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss']
})
export class ListFilterComponent implements OnInit, OnDestroy {
  @Input() FullName: string;
  @Input() ExcludeNonActive: boolean;
  @Input() DanceGroups: Array<any>;
  @Input() DanceGroupID: number;
  danceGroupID = ''; // workaround for ion-select not displaying selected text when the value is number

  danceGroups: any = [];

  modalData = {
    FullName: null,
    Status: null,
    DanceGroupID: null
  };

  private danceGroups$: any;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private authService: AuthService,
    private danceGroupsService: DanceGroupsService
  ) { }

  ngOnInit() {
    this.getDanceGroups();
  }

  ngOnDestroy() {
    if (this.danceGroups$) {
      this.danceGroups$.unsubscribe();
    }
  }

  async getDanceGroups() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Učitavanje grupa u toku..'
    });

    await loading.present();

    if (this.DanceGroups) {
      this.danceGroups = this.DanceGroups.map(dg => {
        return {
          ID: dg.DanceGroupID,
          Name: dg.DanceGroupName
        };
      });

      setTimeout(() => {
        this.populateDialog();
        loading.dismiss();
      }, 500);
    } else {
      this.danceGroups$ = this.danceGroupsService.getLookup().subscribe(
        response => {
          if (response && response['length'] > 0) {
            this.danceGroups = response;

            // if user is not Admin, limit dance groups to the dance groups user belongs to
            if (!this.authService.isAdmin()) {
              let userDanceGroups = this.authService.userModel.UserDanceGroups;
              if (userDanceGroups && userDanceGroups.length > 0) {
                this.danceGroups = this.danceGroups.filter(group => {
                  return !userDanceGroups.includes(group.Name);
                });
              }
            }

            setTimeout(() => {
              this.populateDialog();
            }, 500);
          }
        },
        error => {
          console.error('DANCE GROUPS LOOKUP ERROR', error);
          loading.dismiss();
          this.danceGroups = [];
          this.showToast('Došlo je do greške prilikom preuzimanja spiska plesnih grupa.', 'danger');
        },
        () => {
          loading.dismiss();
        }
      );
    }
  }

  populateDialog() {
    if (this.FullName) {
      this.modalData['FullName'] = this.FullName;
    }

    if (this.DanceGroupID) {
      this.modalData['DanceGroupID'] = this.DanceGroupID;
      this.danceGroupID = 'dgid_' + this.DanceGroupID;
    }

    if (this.ExcludeNonActive) {
      this.modalData['Status'] = 'active';
    } else {
      this.modalData['Status'] = 'all';
    }
  }

  applyFilter() {
    if (this.danceGroupID) {
      this.modalData['DanceGroupID'] = Number(this.danceGroupID.split('_')[1]);
    }

    this.modalController.dismiss({
      filterData: this.modalData
    });
  }

  removeStatusSelection() {
    this.modalData['Status'] = undefined;
  }

  removeDanceGroupSelection() {
    this.modalData['DanceGroupID'] = undefined;
    this.danceGroupID = '';
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

  cancel() {
    this.modalController.dismiss();
  }
}
