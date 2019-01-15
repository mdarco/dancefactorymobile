import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DanceGroupsService {
  apiUrl = environment.apiUrl;
  rootUrl: string = '/api/dance-groups';
  
  constructor(private http: HttpClient) { }

  getLookup() {
    const url = this.apiUrl + this.rootUrl + '/lookup?nd=' + Date.now();
    return this.http.get(url);
  }
}
