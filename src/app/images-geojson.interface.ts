export interface CrsProperties {
  name: string;
  baseAltitude: number;
}

export interface Crs {
  type: string;
  properties: CrsProperties;
}

export interface FeatureProperties {
  id: string;
  time: Date;
  taken: string;
  description: string;
  originalFile: string;
  width: number;
  height: number;
  format: string;
  kuula: string;
  longitude: string;
  latitude: string;
  altitudeFeet: number;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Feature {
  type: string;
  properties: FeatureProperties;
  geometry: Geometry;
}

export interface FeatureCollection {
  type: string;
  crs: Crs;
  features: Feature[];
}

