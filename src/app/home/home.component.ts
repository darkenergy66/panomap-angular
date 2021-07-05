import { Component, OnInit } from '@angular/core';
import { ImageDataService } from '../image-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private imageData: ImageDataService) { }

  ngOnInit(): void {
  }

}
