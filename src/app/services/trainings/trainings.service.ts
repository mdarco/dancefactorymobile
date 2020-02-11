import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {
  apiUrl = environment.apiUrl;
  rootUrl = '/api/trainings';

  constructor(private http: HttpClient) { }

  getFilteredTrainings(filter: any) {
    // console.log('FILTER', filter);
    const url = this.apiUrl + this.rootUrl + '/filtered?nd=' + Date.now();
    return this.http.post(url, filter);
  }

  getTraining(id: number) {
    const url = this.apiUrl + this.rootUrl + '/' + id + '?nd=' + Date.now();
    return this.http.get(url);
  }

  createTraining(model: any) {
    const url = this.apiUrl + this.rootUrl;
    return this.http.post(url, model);
  }

  editTraining(id: number, model: any) {
    const url = this.apiUrl + this.rootUrl + '/' + id;
    return this.http.put(url, model);
  }

  deleteTraining(id: number) {
    const url = this.apiUrl + this.rootUrl + '/' + id;
    return this.http.delete(url);
  }

  //#region Member presence

  getMemberPresenceRegistrations(id: number) {
    const url = this.apiUrl + this.rootUrl + '/' + id + '/member-presence?nd=' + Date.now();
    return this.http.get(url);
  }

  updateMemberPresenceRegistration(id: number, memberId: number, model: any) {
    const url = this.apiUrl + this.rootUrl + '/' + id + '/member-presence/' + memberId + '?nd=' + Date.now();
    return this.http.post(url, model);
  }

  //#endregion
}
