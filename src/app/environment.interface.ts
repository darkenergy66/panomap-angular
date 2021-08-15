export interface Environment {
  production: boolean;
  imagesBaseUrl?: string;
  mapbox: {
    accessToken: string;
  }
  init: {
    map: {
      style: string;
      zoom?: number;
      center: number[];
    }
  }
  imageFormats: ImageFormat[];
}

export interface ImageFormat {
  key: string;
  name: string;
  icon: string;
  iconId: string;
  marker: string;
}
