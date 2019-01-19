import { Component, OnInit, OnDestroy } from '@angular/core';

import { LoadingController, ToastController } from '@ionic/angular';

import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { MembersService } from '../services/members/members.service';

@Component({
  selector: 'app-member-docs',
  templateUrl: './member-docs.page.html',
  styleUrls: ['./member-docs.page.scss'],
})
export class MemberDocsPage implements OnInit {
  memberDetails$: Subscription;

  getMemberDocs$: Subscription;
  memberDocs: any;

  constructor(
    private membersService: MembersService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.memberDetails$ = this.membersService.memberDetails_content$.subscribe(details => {
      const memberId = details['MemberID'];
      this.getMemberDocuments(memberId);
    });
  }

  ngOnDestroy() {
    this.memberDetails$.unsubscribe();
    this.getMemberDocs$.unsubscribe();
  }

  async getMemberDocuments(memberId) {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Molim Vas, sačekajte...'
    });

    await loading.present();

    this.getMemberDocs$ = this.membersService.getMemberDocuments(memberId).subscribe(
      response => {
        // console.log('RESPONSE', response);
        if (response) {
          this.memberDocs = response;
        }
      },
      error => {
        // console.log('MEMBER DOCS ERROR', error);
        this.memberDocs = [];
        this.showToast('Došlo je do greške prilikom preuzimanja dokumenata.');
      },
      () => {
        loading.dismiss();
      }
    );
  }

  resolveCardTitleColor(doc) {
    if (doc.Metadata && doc.Metadata.ExpiryDate) {
      var today = moment(Date.now());
      var expiryDate = moment(doc.Metadata.ExpiryDate);

      if (expiryDate < today) {
          return 'danger';
      }
    }
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
