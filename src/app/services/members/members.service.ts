import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  _searchFilter = null;

  apiUrl = environment.apiUrl;
  rootUrl: string = '/api/members';

  constructor(private http: HttpClient) { }

  getFilteredMembers(filter) {
    // console.log('FILTER', filter);
    const url = this.apiUrl + this.rootUrl + '/filtered?nd=' + Date.now();
    return this.http.post(url, filter);
  }
}
