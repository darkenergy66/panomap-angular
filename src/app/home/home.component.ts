import {Component, OnDestroy, OnInit, ChangeDetectorRef, ElementRef} from '@angular/core';
import { ImageDataService } from '../image-data.service';
import { Maps, Map } from '../maps-list.interface';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { GeoJSONSource, Map as MapboxMap, MapLayerMouseEvent, MapMouseEvent, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  mapParams = environment.init.map;
  formats = environment.formats;
  key: string | null = '';
  thisMap: Map | null = null;
  map: MapboxMap | null = null;
  formatKeys: any[];
  markerImagesLoaded = false;
  spiderifier: any;
  cursorStyle = 'default';
  SPIDERFY_FROM_ZOOM = 10;
  popupFeature: GeoJSON.Feature<GeoJSON.Point> | undefined = undefined;
  popupHtml = '';

  mapsSubscription: Subscription;

  constructor(
    private imageData: ImageDataService,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private elementRef: ElementRef
  )
  {

    this.formatKeys = Object.keys(this.formats);
    this.activatedRoute.paramMap.subscribe(params => {
      this.key = params.get('key');
      if (this.key) {
        this.thisMap = this.imageData.getMap<Map>(this.key);
        console.log('Specific map data loaded');
        if (this.thisMap && this.thisMap['mapbox']) {
          this.showMap();
        }
      }
    });

    this.mapsSubscription = imageData.data$.subscribe(Maps => {
      if (Maps) {
        if (this.key) {
          this.thisMap = this.imageData.getMap<Map>(this.key);
          if (this.thisMap && this.thisMap['mapbox']) {
            console.log('Initial map data loaded', this.thisMap);
            this.showMap();
          }
        }
        this.mapsSubscription?.unsubscribe();
      }
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.mapsSubscription?.unsubscribe();
  }

  mapLoad(map: MapboxMap) {
    this.map = map;
    console.log('this.map>>', this.map);
  }

  showMap() {
    if (this.thisMap)
      this.mapParams['center'] = this.thisMap?.mapbox.center || environment.init.map.center;
      this.mapParams['zoom'] = this.thisMap?.mapbox.zoom || environment.init.map.zoom;
      this.mapParams['style'] = this.thisMap?.mapbox.style || environment.init.map.style;
  }

  imageLoaded(key: any, testId: any) {
    console.log('loaded', key, 'formatKeys', this.formatKeys, 'id', testId);
    const index = this.formatKeys.indexOf(key);
    if (index > -1) {
      this.formatKeys.splice(index, 1);
    }
    if (this.formatKeys.length === 0) {
      this.markerImagesLoaded = true;
      console.log('Marker images loaded');
    }
  }

  imageClick(e: MapLayerMouseEvent) {
    console.log('imageClick event', e);
  }

  clusterClick(e: MapLayerMouseEvent) {
    this.popupHtml = 'Loading...';
    const features: any = this.map?.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });
    if (!features?.length) {
      return;
    } else {
      if (features[0]['properties']['cluster']) {
        if (this.map && this.map?.getZoom() < this.SPIDERFY_FROM_ZOOM) {
          this.map?.easeTo({center: e.lngLat, zoom: this.map?.getZoom() + 2});
        } else {
          const source: mapboxgl.GeoJSONSource = this.map?.getSource('images') as mapboxgl.GeoJSONSource
          this.popupFeature = features[0];

          source.getClusterLeaves(
            features[0].properties.cluster_id,
            100,
            0,
            (err, leafFeatures) => {
              if (err) {
                return console.error('error while getting leaves of a cluster', err);
              }

              let html = '<ul class="cluster-popup-list">';
              leafFeatures.forEach( feature => {
                html += '<li class="cluster-popup-list-item">';
                // @ts-ignore
                html += '<img src="' + this.formats[feature?.properties?.format].icon + '">';
                html += '<span>' + feature?.properties?.taken + '</span>';
                html += '</li>';
              })
              html += '</ul>';

              this.popupHtml = html;
              this.ref.detectChanges();

              let imageLinks = this.elementRef.nativeElement.querySelectorAll('.cluster-popup-list-item');
              imageLinks.forEach( (imageLink: {
                addEventListener: (arg0: string, arg1: () => void) => void;
              }) => {
                imageLink.addEventListener('click', this.onFeatureClick.bind(this));
              });

              console.log('leafFeatures', leafFeatures);

            }
          );
        }
      }
    }
  }

  onFeatureClick() {
    console.log('onFeatureClick', this);
    this.elementRef.nativeElement.querySelector('.cluster-popup-list-item').removeEventListener('click');
  }
}
