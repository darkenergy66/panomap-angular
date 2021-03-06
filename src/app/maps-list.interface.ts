// import {FeatureCollection} from "./images-geojson.interface";
import {
  GeoJSONSource,
  GeoJSONSourceOptions,
  GeoJSONSourceRaw,
} from 'mapbox-gl';

export interface Source {
  source: string;
  type: string;
  url: string;
}

export interface Layer {
  id: string;
  type: "symbol" | "background" | "circle" | "fill-extrusion" | "fill" | "heatmap" | "hillshade" | "line" | "raster" | "custom" | "sky";
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
  images: GeoJSON.FeatureCollection;
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
