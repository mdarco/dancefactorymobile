import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ToastController, ModalController, ActionSheetController } from '@ionic/angular';
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

  async openActionSheet(installment) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Plaćanja',
      buttons: [{
        text: 'Poništi',
        handler: () => {
          this.showToast('Plaćanje poništeno.', 'primary')
        }
      }, {
        text: 'Izmeni status (plaćeno/neplaćeno)',
        handler: () => {
          this.showToast('Izmena statusa.', 'secondary')
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
