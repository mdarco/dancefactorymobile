import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss']
})
export class ListFilterComponent implements OnInit {
  modalData = {};

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  removeStatusSelection() {
    this.modalData['Status'] = undefined;
  }

  removeDanceGroupSelection() {
    this.modalData['DanceGroupID'] = undefined;
  }

  applyFilter() {
    this.modalController.dismiss({
      filterData: this.modalData
    });
  }

  cancel() {
    this.modalController.dismiss();
  }
}
