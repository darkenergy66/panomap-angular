import { Component } from '@angular/core';

@Component({
  template: `
    <mgl-map
      [style]="'mapbox://styles/mapbox/satellite-v9'"
      [zoom]="[17]"
      [center]="[-2.037968774244869, 51.44730046289278]"
    >
    </mgl-map>
  `,
  styles: [
    `
      mgl-map {
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class MapComponent {}
