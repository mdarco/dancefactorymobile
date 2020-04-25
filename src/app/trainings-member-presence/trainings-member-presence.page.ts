import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
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

  private trainingId: number;

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private trainingsService: TrainingsService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.has('id')) {
      this.trainingId = Number(this.route.snapshot.paramMap.get('id'));
      this.getMemberPresence(this.trainingId);
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

  async openActionSheet(event, member) {
    event.stopPropagation(); // prevents calling 'toggleMemberPresenceStatus()' when open action sheet button is tapped

    const button_changeMemberStatus = {
      text: 'Izmeni status (prisutan/nije prisutan)',
        handler: async () => {
          const loading = await this.loadingController.create({
            spinner: 'circles',
            message: 'Molim Vas, sačekajte...'
          });
      
          await loading.present();

          this.trainingsService.updateMemberPresence(
            this.trainingId,
            member.MemberID,
            { IsPresent: !member.IsPresent }
          ).subscribe(
            () => {
              member.IsPresent = !member.IsPresent;
            },
            error => {
              this.showAlert('Došlo je do greške prilikom ažuriranja prozivnika.');
              loading.dismiss();
            },
            () => {
              loading.dismiss();
            }
          );
        }
    };

    const button_absenceJustified = {
      text: 'Odsustvo opravdano? (da/ne)',
        handler: async () => {
          const loading = await this.loadingController.create({
            spinner: 'circles',
            message: 'Molim Vas, sačekajte...'
          });
      
          await loading.present();

          this.trainingsService.updateMemberPresence(
            this.trainingId,
            member.MemberID,
            { AbsenceJustified: !member.AbsenceJustified }
          ).subscribe(
            () => {
              member.AbsenceJustified = !member.AbsenceJustified;
            },
            error => {
              this.showAlert('Došlo je do greške prilikom ažuriranja prozivnika.');
              loading.dismiss();
            },
            () => {
              loading.dismiss();
            }
          );
        }
    };

    const button_note = {
      text: 'Komentar',
        handler: async () => {
          await this.editNote(member);
        }
    };

    const button_close = {
      text: 'Zatvori',
        icon: 'close',
        role: 'cancel',
        handler: () => {}
    };

    const buttons = [];
    buttons.push(button_close);
    buttons.push(button_changeMemberStatus);

    if (!member.IsPresent) {
      buttons.push(button_absenceJustified);
      buttons.push(button_note);
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Prozivnik',
      buttons
    });
    await actionSheet.present();
  }

  async openTrainingActionSheet() {
    const button_note = {
      text: 'Komentar',
        handler: async () => {
          await this.editTrainingNote();
        }
    };

    const button_close = {
      text: 'Zatvori',
        icon: 'close',
        role: 'cancel',
        handler: () => {}
    };

    const buttons = [];
    buttons.push(button_close);
    buttons.push(button_note);

    const actionSheet = await this.actionSheetController.create({
      header: 'Trening',
      buttons
    });
    await actionSheet.present();
  }

  async editNote(member) {
    const prompt = await this.alertController.create({
      header: 'Komentar',
      inputs: [
        {
          name: 'note',
          type: 'text',
          value: member.AbsenceNote
        }
      ],
      buttons: [
        {
          text: 'Odustani',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Obriši',
          handler: async () => {
            const loading = await this.loadingController.create({
              spinner: 'circles',
              message: 'Molim Vas, sačekajte...'
            });
        
            await loading.present();
  
            this.trainingsService.updateMemberPresence(
              this.trainingId,
              member.MemberID,
              { ForceDeleteAbsenceNote: true }
            ).subscribe(
              () => {
                member.AbsenceNote = null;
              },
              error => {
                this.showAlert('Došlo je do greške prilikom ažuriranja prozivnika.');
                loading.dismiss();
              },
              () => {
                loading.dismiss();
              }
            );
          }
        },
        {
          text: 'Ok',
          handler: async (propmptTextObj) => {
            const loading = await this.loadingController.create({
              spinner: 'circles',
              message: 'Molim Vas, sačekajte...'
            });
        
            await loading.present();
  
            this.trainingsService.updateMemberPresence(
              this.trainingId,
              member.MemberID,
              { AbsenceNote: propmptTextObj.note }
            ).subscribe(
              () => {
                member.AbsenceNote = propmptTextObj.note;
              },
              error => {
                this.showAlert('Došlo je do greške prilikom ažuriranja prozivnika.');
                loading.dismiss();
              },
              () => {
                loading.dismiss();
              }
            );
          }
        }
      ]
    });

    await prompt.present();
  }

  async editTrainingNote() {
    const prompt = await this.alertController.create({
      header: 'Komentar',
      inputs: [
        {
          name: 'note',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Odustani',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Obriši',
          handler: async () => {
            // const loading = await this.loadingController.create({
            //   spinner: 'circles',
            //   message: 'Molim Vas, sačekajte...'
            // });
        
            // await loading.present();
  
            // this.trainingsService.updateMemberPresence(
            //   this.trainingId,
            //   member.MemberID,
            //   { ForceDeleteAbsenceNote: true }
            // ).subscribe(
            //   () => {
            //     member.AbsenceNote = null;
            //   },
            //   error => {
            //     this.showAlert('Došlo je do greške prilikom ažuriranja prozivnika.');
            //     loading.dismiss();
            //   },
            //   () => {
            //     loading.dismiss();
            //   }
            // );
          }
        },
        {
          text: 'Ok',
          handler: async (propmptTextObj) => {
            // const loading = await this.loadingController.create({
            //   spinner: 'circles',
            //   message: 'Molim Vas, sačekajte...'
            // });
        
            // await loading.present();
  
            // this.trainingsService.updateMemberPresence(
            //   this.trainingId,
            //   member.MemberID,
            //   { AbsenceNote: propmptTextObj.note }
            // ).subscribe(
            //   () => {
            //     member.AbsenceNote = propmptTextObj.note;
            //   },
            //   error => {
            //     this.showAlert('Došlo je do greške prilikom ažuriranja prozivnika.');
            //     loading.dismiss();
            //   },
            //   () => {
            //     loading.dismiss();
            //   }
            // );
          }
        }
      ]
    });

    await prompt.present();
  }

  async toggleMemberPresenceStatus(member) {
    let changeObj: any = {};

    if (member.IsPresent) {
      changeObj.IsPresent = false;
      changeObj.AbsenceJustified = true;
    }

    if (!member.IsPresent) {
      if (member.AbsenceJustified) {
        changeObj.AbsenceJustified = false;
      } else {
        changeObj.IsPresent = true;
        changeObj.AbsenceJustified = true;
      }
    }

    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Molim Vas, sačekajte...'
    });

    await loading.present();

    this.trainingsService.updateMemberPresence(
      this.trainingId,
      member.MemberID,
      changeObj
    ).subscribe(
      () => {
        member.IsPresent = changeObj.IsPresent;
        member.AbsenceJustified = changeObj.AbsenceJustified;
      },
      error => {
        this.showAlert('Došlo je do greške prilikom ažuriranja prozivnika.');
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
