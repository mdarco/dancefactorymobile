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

  applyFilter() {
    this.modalController.dismiss({
      success: true
    });
  }

  cancel() {
    this.modalController.dismiss();
  }
}
