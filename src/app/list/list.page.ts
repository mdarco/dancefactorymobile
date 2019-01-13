import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public members: Array<any> = [];
  
  constructor() {
    this.members = [
      { FullName: 'Pera Detlic', IsActive: true },
      { FullName: 'Mornar Popaj', IsActive: false },
      { FullName: 'Lale Gator', IsActive: true }
    ];
  }

  ngOnInit() { }
}
