import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {

  constructor(private http: HttpClient) {
    this.http.get(environment.imagesBaseUrl + 'maps-list.json').toPromise().then( mapsList => {
      console.log('mapsList', mapsList);

    })
  }
}
