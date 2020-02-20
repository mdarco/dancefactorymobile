import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { TrainingsService } from '../services/trainings/trainings.service';

@Component({
  selector: 'app-trainings-member-presence',
  templateUrl: './trainings-member-presence.page.html',
  styleUrls: ['./trainings-member-presence.page.scss'],
})
export class TrainingsMemberPresencePage implements OnInit, OnDestroy {
  private trainingMembers$: any;

  private members: any;
  private membersTotalCount: number;
  private membersPresentCount: number;

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private trainingsService: TrainingsService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.has('id')) {
      let trainingId = Number(this.route.snapshot.paramMap.get('id'));
      this.getMemberPresence(trainingId);
    }
  }

  ngOnDestroy() {
    if (this.trainingMembers$) {
      this.trainingMembers$.unsubscribe();
    }
  }

  async getMemberPresence(trainingId: number) {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Molim Vas, sačekajte...'
    });

    await loading.present();

    this.trainingMembers$ = this.trainingsService.getMemberPresence(trainingId).subscribe(
      (response: any) => {
        // console.log('TRAINING MEMBERS', response);
        this.members = response;
        this.membersTotalCount = response.length;
        this.membersPresentCount = this.members.filter(m => m.IsPresent).length;
      },
      error => {
        // console.log('TRAINING MEMBERS ERROR', error);
        this.members = [];
        this.membersTotalCount = null;
        this.membersPresentCount = null;
        this.showAlert('Došlo je do greške prilikom preuzimanja prozivnika.');
        loading.dismiss();
      },
      () => {
        loading.dismiss();
      }
    );
  }

  getStatusColor(member) {
    if (member.IsPresent) {
      return 'success';
    }

    if (!member.IsPresent) {
        if (member.AbsenceJustified) {
            return 'primary';
        } else {
            return 'danger';
        }
    }
  }

  showAlert(msg: string) {
    const alert = this.alertController.create({
      message: msg,
      header: 'Greška',
      buttons: ['OK']
    });
    alert.then(a => a.present());
  }
}
