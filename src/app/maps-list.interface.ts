import {FeatureCollection} from "./images-geojson.interface";

export interface Source {
  source: string;
  type: string;
  url: string;
}

export interface Layer {
  id: string;
  type: string;
  source: string;
}

export interface Mapbox {
  center: number[];
  zoom: number;
  style: string;
  sources: Source[];
  layers: Layer[];
}

export interface Map {
  key: string;
  title: string;
  description: string;
  images: FeatureCollection;
  mapbox: Mapbox;
}

export interface Maps {
  title: string;
  maps: Map[];
}

export interface MapMenu {
  key: string;
  title: string;
  description: string;
}
