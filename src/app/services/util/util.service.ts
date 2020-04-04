import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  isObjectEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  convertJsDateToIsoDate(date: any) {
    let year = date.getFullYear();
    
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }

    let day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  }
}
