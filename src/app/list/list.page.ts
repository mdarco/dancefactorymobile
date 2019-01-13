import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController, ToastController, ModalController } from '@ionic/angular';

import { MembersService } from '../services/members/members.service';

import { ListFilterComponent } from '../list-filter/list-filter.component';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {
  private getMembers$: any;

  filter = {
    PageNo: 1,
    RecordsPerPage: 10,
    ExcludeNonActive: false
  };

  members: Array<any> = [];
  membersTotal?: number = null;
  membersDisplayed?: number = null;
  
  constructor(
    private membersService: MembersService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController) { }

  ngOnInit() {
    this.applyFilter();
  }

  ngOnDestroy() {
    this.getMembers$.unsubscribe();
  }

  async applyFilter() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Molim Vas, sačekajte...'
    });

    await loading.present();

    this.getMembers$ = this.membersService.getFilteredMembers(this.filter).subscribe(
      response => {
        // console.log('RESPONSE', response);
        if (response && response['Data'] && response['Data'].length > 0) {
          this.members = this.members.concat(response['Data']);
          this.membersTotal = response['Total'];
          this.membersDisplayed = this.filter.PageNo * this.filter.RecordsPerPage;
          // console.log('MEMBERS', this.members);
        }
      },
      error => {
        // console.log('MEMBERS ERROR', error);
        this.members = [];
        this.membersTotal = null;
        this.membersDisplayed = null;
        this.showAlert('Došlo je do greške prilikom preuzimanja liste plesača.');
      },
      () => {
        loading.dismiss();
      }
    );
  }

  async onInfiniteScroll(event) {
    this.filter.PageNo++;
    await this.applyFilter();
    event.target.complete();

    if (this.membersDisplayed === this.membersTotal) {
      event.target.disabled = true;
    }
  }

  async showFilterDialog() {
    // await this.showWipToast();

    const modal = await this.modalController.create({
      component: ListFilterComponent
      // componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.showAlert('Filter closed..');
    }
  }

  async showAddMemberDialog() {
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
