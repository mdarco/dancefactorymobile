import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ToastController, AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import * as moment from 'moment';

import { MembersService } from '../services/members/members.service';

@Component({
  selector: 'app-installments',
  templateUrl: './installments.component.html',
  styleUrls: ['./installments.component.scss']
})
export class InstallmentsComponent implements OnInit, OnDestroy {
  @Input() memberId: number;
  @Input() paymentId: number;

  installments: any = [];
  installments$: any;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private membersService: MembersService
  ) { }

  ngOnInit() {
    this.getInstallments();
  }

  ngOnDestroy() {
    this.installments$.unsubscribe();
  }

  async getInstallments() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Učitavanje u toku..'
    });

    await loading.present();

    this.installments$ = this.membersService.getMemberPaymentInstallments(this.memberId, this.paymentId).subscribe(
      response => {
        if (response && response['length'] > 0) {
          this.installments = response;
        }
      },
      error => {
        console.error('INSTALLMENTS ERROR', error);
        this.installments = [];
        this.showToast('Došlo je do greške prilikom preuzimanja spiska rata.', 'danger');
        loading.dismiss();
      },
      () => {
        loading.dismiss();
      }
    );
  }

  async editInstallment(installment, model) {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Molim Vas, sačekajte..'
    });

    await loading.present();

    this.membersService.editMemberPaymentInstallment(this.memberId, this.paymentId, installment.ID, model).subscribe(
      () => {
        Object.keys(model).forEach(key => {
          installment[key] = model[key];

          if (key === 'IsPaid') {
            if (!model[key]) {
              installment.PaymentDate = undefined;
            } else {
              installment.PaymentDate = Date.now();
            }
          }
        });
        this.showToast('Rata plaćanja je uspešno ažurirana.', 'success');
      },
      error => {
        console.error('EDIT INSTALLMENT ERROR', error);
        this.showToast('Došlo je do greške prilikom izmene rate plaćanja.', 'danger');
        loading.dismiss();
      },
      () => {
        loading.dismiss();
      }
    );
  }

  async openActionSheet(installment) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Plaćanja',
      buttons: [{
        text: (!installment.IsCanceled ? 'Poništi ratu' : 'Aktiviraj ratu'),
        handler: () => {
          this.showConfirmDialog(
            'Da li ste sigurni?',
            (!installment.IsCanceled ? 'Poništavate plaćanje?' : 'Aktivirate plaćanje?'),
            () => {
              this.editInstallment(installment, {
                IsCanceled: !installment.IsCanceled
              });
            }
          );
        }
      }, {
        text: 'Izmeni status (plaćeno/neplaćeno)',
        handler: () => {
          this.showConfirmDialog(
            'Da li ste sigurni?',
            (!installment.IsPaid ? 'Rata je plaćena?' : 'Rata nije plaćena?'),
            () => {
              this.editInstallment(installment, {
                IsPaid: !installment.IsPaid
              });
            }
          );
        }
      }, {
        text: 'Zatvori',
        icon: 'close',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await actionSheet.present();
  }

  getStatusColor(installment) {
    if (installment.IsPaid) {
      return 'success';
    }

    if (!installment.IsPaid) {
        const today = moment(Date.now());
        const installmentDate = moment(installment.InstallmentDate);

        if (installmentDate > today) {
            return 'primary';
        } else {
            return 'danger';
        }
    }
  }

  async showConfirmDialog(header, message, yesCallback?, noCallback?) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'Ne',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          if (noCallback) {
            noCallback();
          }
        }
      }, {
        text: 'Da',
          handler: () => {
            if (yesCallback) {
              yesCallback();
            }
          }
      }]
    });

    await alert.present();
  }

  cancel() {
    this.modalController.dismiss();
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
}
