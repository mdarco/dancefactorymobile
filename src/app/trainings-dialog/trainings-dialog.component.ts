import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { DanceGroupsService } from '../services/dance-groups/dance-groups.service';
import { LookupService } from '../services/lookup/lookup.service';
import { TrainingsService } from '../services/trainings/trainings.service';

@Component({
  selector: 'app-trainings-dialog',
  templateUrl: './trainings-dialog.component.html',
  styleUrls: ['./trainings-dialog.component.scss']
})
export class TrainingsDialogComponent implements OnInit, OnDestroy {
  trainingDate = null;
  trainingDanceGroupID = '';
  trainingScheduleID = '';
  trainerUserID = '';
  
  danceGroups: any = [];
  schedules: any = [];
  trainers: any = [];

  private danceGroups$: any;
  private schedules$: any;
  private trainers$: any;
  
  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private authService: AuthService,
    private danceGroupsService: DanceGroupsService,
    private lookupService: LookupService,
    private trainingsService: TrainingsService
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
    this.schedules$ = this.trainingsService.getTrainingSchedules().pipe(catchError(err => of('error_schedules')));
    this.trainers$ = this.lookupService.getTrainers().pipe(catchError(err => of('error_trainers')));

    forkJoin([this.danceGroups$, this.schedules$, this.trainers$]).subscribe(combos => {
      if (combos[0] !== 'error_dancegroups') {
        // console.log('dance_groups', combos[0]);
        this.danceGroups = combos[0];
      }

      if (combos[1] !== 'error_schedules') {
        // console.log('schedules', combos[1]);
        this.schedules = combos[1];
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

      // console.log(this.danceGroups);
      // console.log(this.schedules);
      // console.log(this.trainers);

      loading.dismiss();
    });
  }

  removeTrainingDanceGroupSelection() {
    this.trainingDanceGroupID = '';
  }

  removeTrainingLocationSelection() {
    this.trainingScheduleID = '';
  }

  removeTrainingUserSelection() {
    this.trainerUserID = '';
  }

  removeTrainingDateSelection() {
    this.trainingDate = '';
  }

  cancel() {
    this.modalController.dismiss();
  }
}
