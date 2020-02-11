import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController, ToastController, ModalController } from '@ionic/angular';

import { AuthService } from '../services/auth/auth.service';
import { TrainingsService } from '../services/trainings/trainings.service';

import { TrainingsFilterComponent } from '../trainings-filter/trainings-filter.component';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.page.html',
  styleUrls: ['./trainings.page.scss'],
})
export class TrainingsPage implements OnInit, OnDestroy {
  private getTrainings$: any;

  filter: any = {
    PageNo: 1,
    RecordsPerPage: 10,
    TrainingDate: undefined,
    TrainingLocationID: undefined,
    TrainingDanceGroupID: undefined,
    TrainerUserID: undefined
  };

  trainings: Array<any> = [];
  trainingsTotal?: number = null;
  trainingsDisplayed?: number = null;

  constructor(
    private authService: AuthService,
    private trainingsService: TrainingsService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.checkUserDanceGroups();
    this.applyFilter();
  }

  ngOnDestroy() {
    this.getTrainings$.unsubscribe();
  }

  checkUserDanceGroups() {
    // see if user a part of any dance groups and set filter accordingly
    if (this.authService.userModel.UserDanceGroups && this.authService.userModel.UserDanceGroups.length > 0) {
      this.filter.TrainingDanceGroupID = this.authService.userModel.UserDanceGroups[0].DanceGroupID;
    }
  }

  async applyFilter(noConcat = false) {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Molim Vas, sačekajte...'
    });

    await loading.present();

    this.getTrainings$ = this.trainingsService.getFilteredTrainings(this.filter).subscribe(
      response => {
        // console.log('RESPONSE', response);
        if (response && response['Data'] && response['Data'].length > 0) {
          if (noConcat) {
            this.trainings = response['Data'];
          } else {
            this.trainings = this.trainings.concat(response['Data']);
          }

          this.trainingsTotal = response['Total'];
          this.trainingsDisplayed = this.filter.PageNo * this.filter.RecordsPerPage;

          if (this.trainingsTotal < this.trainingsDisplayed) {
            this.trainingsDisplayed = this.trainingsTotal;
          }
        }
      },
      error => {
        // console.log('TRAININGS ERROR', error);
        this.trainings = [];
        this.trainingsTotal = null;
        this.trainingsDisplayed = null;
        this.showAlert('Došlo je do greške prilikom preuzimanja liste trenings.');
        loading.dismiss();
      },
      () => {
        loading.dismiss();
      }
    );
  }

  resetFilter() {
    this.filter = {
      PageNo: 1,
      RecordsPerPage: 10,
      TrainingDate: undefined,
      TrainingLocationID: undefined,
      TrainingDanceGroupID: undefined,
      TrainerUserID: undefined
    };

    this.checkUserDanceGroups();
    this.applyFilter(true);
  }

  async onInfiniteScroll(event) {
    this.filter.PageNo++;
    await this.applyFilter();
    event.target.complete();
  }

  async showFilterDialog() {
    const modal = await this.modalController.create({
      component: TrainingsFilterComponent,
      componentProps: this.filter
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.filterData) {
      this.filter.PageNo = 1;

      // TODO: set filter values here..

      this.applyFilter(true);
    }
  }

  async showAddTrainingDialog() {
    await this.showWipToast();
  }

  showAlert(msg: string) {
    const alert = this.alertController.create({
      message: msg,
      header: 'Greška',
      buttons: ['OK']
    });
    alert.then(a => a.present());
  }

  async showWipToast() {
    const toast = await this.toastController.create({
      message: 'Work in progress...',
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }
}
