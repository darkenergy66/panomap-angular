import {Component, OnDestroy, OnInit} from '@angular/core';
import { ImageDataService } from '../image-data.service';
import { Maps, Map, MapMenu } from '../maps-list.interface';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})

export class ConsoleComponent implements OnInit, OnDestroy {

  title: string = '';
  mapMenu: MapMenu[] = [];

  mapsSubscription: Subscription;

  constructor(private imageData: ImageDataService) {
    this.mapsSubscription = imageData.data$.subscribe(maps => {
      if (maps) {
        this.initMapList(maps);
        this.mapsSubscription?.unsubscribe();
      }
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  initMapList(maps: Maps) {
    this.title = maps.title;
    for (let map of maps.maps) {
      this.mapMenu.push(
        {
          key: map.key,
          title: map.title,
          description: map.description
        }
      )
    }
    console.log(this.mapMenu);
  }
}
