import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Maps, Source, Layer, Mapbox, Map } from './maps-list.interface';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {

  constructor(private http: HttpClient) {
    this.http.get<Maps>(environment.imagesBaseUrl + 'maps-list.json').toPromise().then( mapsList => {
      console.log('mapsList', mapsList);
      // if (mapsList['x']) {
      //
      // }
      // console.log('keys', Object.keys(maps));
    })
  }
}
