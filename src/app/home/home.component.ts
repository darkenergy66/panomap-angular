import { Component, OnInit } from '@angular/core';
import { ImageDataService } from '../image-data.service';
import { Maps, Map } from '../maps-list.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private imageData: ImageDataService) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      console.log('All', this.imageData.get<Maps>());
      console.log('hazeland-20210321', this.imageData.getMap<Map>('hazeland-20210124'));
      }, 1000);

  }

}
