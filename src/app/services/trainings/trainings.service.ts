import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {
  apiUrl = environment.apiUrl;
  rootUrl = '/api/trainings';
  rootUrl_schedules = '/api/training-schedules';

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

  editTraining(model: any) {
    const url = this.apiUrl + this.rootUrl + '/' + model.id;
    return this.http.put(url, model);
  }

  deleteTraining(id: number) {
    const url = this.apiUrl + this.rootUrl + '/' + id;
    return this.http.delete(url);
  }

  //#region Training schedules

  getTrainingSchedules() {
    const url = this.apiUrl + this.rootUrl_schedules + '?nd=' + Date.now();
    return this.http.get(url);
  }

  //#endregion

  //#region Member presence

  getMemberPresence(id: number) {
    const url = this.apiUrl + this.rootUrl + '/' + id + '/member-presence?nd=' + Date.now();
    return this.http.get(url);
  }

  updateMemberPresence(id: number, memberId: number, model: any) {
    const url = this.apiUrl + this.rootUrl + '/' + id + '/member-presence/' + memberId + '?nd=' + Date.now();
    return this.http.post(url, model);
  }

  //#endregion
}
