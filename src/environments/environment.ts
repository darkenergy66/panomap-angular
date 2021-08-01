// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  imagesBaseUrl: 'http://localhost:8080/',
  mapbox: {
    accessToken: 'pk.eyJ1IjoiaWFuY29sbGlzIiwiYSI6ImNqZXY2MHBnejBhdWUycXFjOXE1NmVyam8ifQ.4ZU6sWMHHmNzOG08U7luRQ'
  },
  init: {
    map: {
      style: 'mapbox://styles/iancollis/ckriy73rb0bj818qv7k2qourc',
      zoom: 2,
      center: [0,0]
    }
  },
  formats: {
    360: {
      name: '360° Pano',
      icon: 'assets/icons/360-icon-30.png',
      iconId: 'icon-360',
      marker: 'assets/icons/360-icon-circle.png'
    },
    180: {
      name: '180° Pano',
      icon: 'assets/icons/180-icon-30.png',
      iconId: 'icon-180',
      marker: 'assets/icons/180-icon-circle.png'
    },
    pic: {
      name: 'Photo',
      icon: 'assets/icons/camera-icon-30.png',
      iconId: 'icon-pic',
      marker: 'assets/icons/pic-icon-circle.png'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


//     accessToken: 'pk.eyJ1Ijoic29jcmF0YSIsImEiOiJjaXJxc2wzam0waGU5ZmZtODhqd2ttamdxIn0.1ZQEByXoDD7fGIa9lUHIqg'
