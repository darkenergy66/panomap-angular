export const environment = {
  production: true,
  imagesBaseUrl: 'http://http://hazeland.panomap.world/',
  mapbox: {
    accessToken: 'pk.eyJ1IjoiaWFuY29sbGlzIiwiYSI6ImNqZXY2MHBnejBhdWUycXFjOXE1NmVyam8ifQ.4ZU6sWMHHmNzOG08U7luRQ'
  },
  init: {
    map: {
      style: 'mapbox://styles/iancollis/ckriy73rb0bj818qv7k2qourc',
      zoom: 16,
      center: [
        -2.037968774244869,
        51.44730046289278]
    }
  },
  imageFormats : [
    {
      key: '360',
      name: '360° Pano',
      icon: 'assets/icons/360-icon-30.png',
      iconId: 'icon-360',
      marker: 'assets/icons/360-icon-circle.png'
    },
    {
      key: '180',
      name: '180° Pano',
      icon: 'assets/icons/180-icon-30.png',
      iconId: 'icon-180',
      marker: 'assets/icons/180-icon-circle.png'
    },
    {
      key: 'pic',
      name: 'Photo',
      icon: 'assets/icons/camera-icon-30.png',
      iconId: 'icon-pic',
      marker: 'assets/icons/pic-icon-circle.png'
    }
  ],
};
