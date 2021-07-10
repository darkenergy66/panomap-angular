import {Component, OnDestroy, OnInit} from '@angular/core';
import { ImageDataService } from '../image-data.service';
import { Maps, Map } from '../maps-list.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  mapsSubscription: Subscription;

  constructor(private imageData: ImageDataService) {
    this.mapsSubscription = imageData.data$.subscribe(Maps => {
      if (Maps) {
        this.initMaps(Maps);
      }
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.mapsSubscription?.unsubscribe();
  }

  initMaps(Maps: Maps) {
    console.log('Maps', Maps);
    console.log('hazeland-20210321', this.imageData.getMap<Map>('hazeland-20210124'));
  }
}
