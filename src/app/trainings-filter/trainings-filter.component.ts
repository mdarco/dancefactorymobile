import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';

import { AuthService } from '../services/auth/auth.service';
import { DanceGroupsService } from '../services/dance-groups/dance-groups.service';
import { LookupService } from '../services/lookup/lookup.service';

@Component({
  selector: 'app-trainings-filter',
  templateUrl: './trainings-filter.component.html',
  styleUrls: ['./trainings-filter.component.scss']
})
export class TrainingsFilterComponent implements OnInit, OnDestroy {
  @Input() TrainingDate: string;
  trainingDate = null;

  @Input() WeekDay: string;

  @Input() TrainingDanceGroupID: number;
  trainingDanceGroupID = ''; // workaround for ion-select not displaying selected text when the value is number

  @Input() TrainingLocationID: number;
  trainingLocationID = ''; // workaround for ion-select not displaying selected text when the value is number

  @Input() TrainerUserID: number;
  trainerUserID = ''; // workaround for ion-select not displaying selected text when the value is number

  danceGroups: any = [];
  locations: any = [];
  trainers: any = [];

  modalData = {
    TrainingDate: null,
    WeekDay: null,
    TrainingDanceGroupID: null,
    TrainingLocationID: null,
    TrainerUserID: null
  };

  private danceGroups$: any;
  private locations$: any;
  private trainers$: any;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private authService: AuthService,
    private danceGroupsService: DanceGroupsService,
    private lookupService: LookupService
  ) { }

  ngOnInit() {
    this.getCombos();
  }

  ngOnDestroy() {
    // no need to unsubscribe from observables returned by 'forkJoin'
  }

  async getCombos() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Učitavanje podataka u toku..'
    });

    await loading.present();

    this.danceGroups$ = this.danceGroupsService.getLookup().pipe(catchError(err => of('error_dancegroups')));
    this.locations$ = this.lookupService.getLocations().pipe(catchError(err => of('error_locations')));
    this.trainers$ = this.lookupService.getTrainers().pipe(catchError(err => of('error_trainers')));

    forkJoin([this.danceGroups$, this.locations$, this.trainers$]).subscribe(combos => {
      if (combos[0] !== 'error_dancegroups') {
        // console.log('dance_groups', combos[0]);
        this.danceGroups = combos[0];
      }

      if (combos[1] !== 'error_locations') {
        // console.log('locations', combos[1]);
        this.locations = combos[1];
      }

      if (combos[2] !== 'error_trainers') {
        // console.log('trainers', combos[2]);
        this.trainers = combos[2];
      }

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
        loading.dismiss();
      }, 500);
    });
  }

  populateDialog() {
    if (this.TrainingDate) {
      this.modalData['TrainingDate'] = this.TrainingDate;
      this.trainingDate = this.TrainingDate;
    }

    if (this.WeekDay) {
      this.modalData['WeekDay'] = this.WeekDay;
    }

    if (this.TrainingDanceGroupID) {
      this.modalData['TrainingDanceGroupID'] = this.TrainingDanceGroupID;
      this.trainingDanceGroupID = 'dgid_' + this.TrainingDanceGroupID;
    }

    if (this.TrainingLocationID) {
      this.modalData['TrainingLocationID'] = this.TrainingLocationID;
      this.trainingLocationID = 'locid_' + this.TrainingLocationID;
    }

    if (this.TrainerUserID) {
      this.modalData['TrainerUserID'] = this.TrainerUserID;
      this.trainerUserID = 'trainerid_' + this.TrainerUserID;
    }
  }

  applyFilter() {
    if (this.trainingDate) {
      this.modalData['TrainingDate'] = this.trainingDate;
    }

    if (this.trainingDanceGroupID) {
      this.modalData['TrainingDanceGroupID'] = Number(this.trainingDanceGroupID.split('_')[1]);
    }

    if (this.trainingLocationID) {
      this.modalData['TrainingLocationID'] = Number(this.trainingLocationID.split('_')[1]);
    }

    if (this.trainerUserID) {
      this.modalData['TrainerUserID'] = Number(this.trainerUserID.split('_')[1]);
    }

    this.modalController.dismiss({
      filterData: this.modalData
    });
  }

  removeTrainingDanceGroupSelection() {
    this.modalData['TrainingDanceGroupID'] = undefined;
    this.trainingDanceGroupID = '';
  }

  removeTrainingLocationSelection() {
    this.modalData['TrainingLocationID'] = undefined;
    this.trainingLocationID = '';
  }

  removeTrainingUserSelection() {
    this.modalData['TrainerUserID'] = undefined;
    this.trainerUserID = '';
  }

  removeTrainingDateSelection() {
    this.modalData['TrainingDate'] = undefined;
    this.trainingDate = '';
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
