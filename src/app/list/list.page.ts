import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController, ToastController, ModalController } from '@ionic/angular';

import { MembersService } from '../services/members/members.service';
import { UtilService } from '../services/util/util.service';

import { ListFilterComponent } from '../list-filter/list-filter.component';
import { filter } from 'rxjs/operators';

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
    ExcludeNonActive: false,
    FullName: undefined,
    DanceGroupID: undefined
  };

  members: Array<any> = [];
  membersTotal?: number = null;
  membersDisplayed?: number = null;
  
  constructor(
    private membersService: MembersService,
    private utilService: UtilService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.applyFilter();
  }

  ngOnDestroy() {
    this.getMembers$.unsubscribe();
  }

  async applyFilter(noConcat = false) {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Molim Vas, sačekajte...'
    });

    await loading.present();

    this.getMembers$ = this.membersService.getFilteredMembers(this.filter).subscribe(
      response => {
        // console.log('RESPONSE', response);
        if (response && response['Data'] && response['Data'].length > 0) {
          if (noConcat) {
            this.members = response['Data'];
          } else {
            this.members = this.members.concat(response['Data']);
          }
          
          this.membersTotal = response['Total'];
          this.membersDisplayed = this.filter.PageNo * this.filter.RecordsPerPage;
          
          if (this.membersTotal < this.membersDisplayed) {
            this.membersDisplayed = this.membersTotal;
          }
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

  resetFilter() {
    this.filter = {
      PageNo: 1,
      RecordsPerPage: 10,
      ExcludeNonActive: false,
      FullName: undefined,
      DanceGroupID: undefined
    };
    this.applyFilter();
  }

  async onInfiniteScroll(event) {
    if (this.membersDisplayed === this.membersTotal) {
      event.target.disabled = true;
    } else {
      this.filter.PageNo++;
      await this.applyFilter();
      event.target.complete();
    }
  }

  async showFilterDialog() {
    const modal = await this.modalController.create({
      component: ListFilterComponent
      // componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.filterData && !this.utilService.isObjectEmpty(data.filterData)) {
      this.filter.PageNo = 1;

      if (data.filterData.Status && data.filterData.Status === 'active') {
        this.filter.ExcludeNonActive = true;
      }

      if (data.filterData.FullName && data.filterData.FullName !== '') {
        this.filter.FullName = data.filterData.FullName;
      }

      if (data.filterData.DanceGroupID && data.filterData.DanceGroupID !== '') {
        this.filter.DanceGroupID = data.filterData.DanceGroupID;
      }

      this.applyFilter(true);
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
