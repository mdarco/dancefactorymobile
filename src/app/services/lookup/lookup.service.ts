import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  apiUrl = environment.apiUrl;
  rootUrl = '/api/lookups';

  constructor(private http: HttpClient) { }

  getLocations() {
    const url = this.apiUrl + this.rootUrl + '/locations?nd=' + Date.now();
    return this.http.get(url);
  }

  getTrainers() {
    const url = this.apiUrl + this.rootUrl + '/trainers?nd=' + Date.now();
    return this.http.get(url);
  }
}
