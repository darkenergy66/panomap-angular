import { Component } from '@angular/core';

@Component({
  template: `
    <div>------</div>
    <mgl-map
      [style]="'mapbox://styles/mapbox/streets-v9'"
      [zoom]="[9]"
      [center]="[-74.5, 40]"
    >
    </mgl-map>
    <div>------</div>
  `,
  styles: [
    `
      mgl-map {
        height: 600px;
        width: 1000px;
      }
    `,
  ],
})
export class MapComponent {}
