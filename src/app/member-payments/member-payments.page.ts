import { Component, OnInit, OnDestroy } from '@angular/core';

import { LoadingController, ToastController, ModalController } from '@ionic/angular';

import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { MembersService } from '../services/members/members.service';

import { InstallmentsComponent } from '../installments/installments.component';

@Component({
  selector: 'app-member-payments',
  templateUrl: './member-payments.page.html',
  styleUrls: ['./member-payments.page.scss'],
})
export class MemberPaymentsPage implements OnInit, OnDestroy {
  memberId: number;
  memberDetails$: Subscription;

  getMemberPayments$: Subscription;
  memberPayments: any;

  constructor(
    private membersService: MembersService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.memberDetails$ = this.membersService.memberDetails_content$.subscribe(details => {
      this.memberId = details['MemberID'];
      this.getMemberPayments(this.memberId);
    });
  }

  ngOnDestroy() {
    this.memberDetails$.unsubscribe();
    this.getMemberPayments$.unsubscribe();
  }

  async getMemberPayments(memberId) {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Molim Vas, sačekajte...'
    });

    await loading.present();

    this.getMemberPayments$ = this.membersService.getMemberPayments(memberId).subscribe(
      response => {
        // console.log('RESPONSE', response);
        if (response) {
          this.memberPayments = response;
        }
      },
      error => {
        // console.log('MEMBER PAYMENTS ERROR', error);
        this.memberPayments = [];
        this.showToast('Došlo je do greške prilikom preuzimanja plaćanja.');
      },
      () => {
        loading.dismiss();
      }
    );
  }

  resolveMemberPaymentStatusBorder(memberPayment) {
    let installments = memberPayment.Installments;
    if (installments && installments.length > 0) {
      let isProblematic = false;
      let isCompleted = true;

      installments.forEach(installment => {
        if (!installment.IsPaid && !installment.IsCanceled) {
          isCompleted = false;

          if (!isProblematic) {
            var today = moment(Date.now());
            var installmentDate = moment(installment.InstallmentDate);

            if (installmentDate < today) {
              isProblematic = true;
            }
          }
        }
      });

      if (isProblematic) {
        return '2px solid red';
      }

      if (isCompleted) {
        return '2px solid green';
      }
    }
    return '';
  }

  async showInstallmentsDialog(payment) {
    const modal = await this.modalController.create({
      component: InstallmentsComponent,
      componentProps: {
        memberId: this.memberId,
        paymentId: payment.ID
      }
    });
    await modal.present();

    // const { data } = await modal.onDidDismiss();
  }

  async showToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }
}
