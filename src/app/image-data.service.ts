import {Injectable, OnInit} from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Maps, Source, Layer, Mapbox, Map } from './maps-list.interface';
import { FeatureCollection, Feature, FeatureProperties, Crs, CrsProperties, Geometry } from './images-geojson.interface';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService implements OnInit {

  private mapImages: any;
  private dataSource = new BehaviorSubject<any>(null);
  data$ = this.dataSource.asObservable();

  constructor(private http: HttpClient) {
    this.http.get<Maps>(environment.imagesBaseUrl + 'maps-list.json').toPromise().then(mapsList => {
      for (let map of mapsList.maps) {
        this.http.get<FeatureCollection>(environment.imagesBaseUrl + map.key + '/' + 'images.geojson').toPromise().then(features => {
          map.images = features;
        })
      }
      this.mapImages = mapsList;
      this.dataSource.next(mapsList);
    });
  }

  ngOnInit() {
  }

  get<Maps>() {
    return this.mapImages;
  }

  getMap<Map>(key: string) {
    for (let map of this.mapImages.maps) {
      if (map.key === key) {
        return map;
      }
    }
  }

}
