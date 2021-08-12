import {Component, OnDestroy, OnInit, ChangeDetectorRef, ElementRef} from '@angular/core';
import { ImageDataService } from '../image-data.service';
import { Maps, Map } from '../maps-list.interface';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { GeoJSONSource, Map as MapboxMap, MapLayerMouseEvent, MapMouseEvent, Marker } from 'mapbox-gl';
import { Feature } from "../images-geojson.interface";
import panzoom from "panzoom";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  mapParams = environment.init.map;
  formats: any = environment.formats;
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
    const features: any = this.map?.queryRenderedFeatures(e.point, {
      layers: ['markers']
    });
    if (!features?.length) {
      return;
    } else {
      this.buildModal(features[0]);
    }
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

              let imageNodeList: NodeList = this.elementRef.nativeElement.querySelectorAll('.cluster-popup-list-item');

              for (let i = 0; i < imageNodeList.length; i++) {
                // @ts-ignore
                imageNodeList[i].addEventListener("click", ($event) => {
                  this.onFeatureClick(leafFeatures[i])
                });
              }
            }
          );
        }
      }
    }
  }

  onFeatureClick(feature: any) {
    this.buildModal(feature);
    // this.elementRef.nativeElement.querySelector('.cluster-popup-list-item').removeEventListener('click', this.onFeatureClick);
  }

  buildModal(feature: any) {
    console.log('feature', feature);

    let imagePath = environment.imagesBaseUrl + this.key + '/' + feature.properties.id + ".jpg";
    console.log('imagePath', imagePath);
    let imageTitle = feature.properties.id + ".jpg";
    let downloadFile = imagePath;

    let header = document.getElementById('image-modal-header');
    if (header) {

      let headerHtml = '<img src="' + this.formats[feature.format].icon + '"><h5>' + this.formats[feature.format].name + '</h5>';
      headerHtml += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
      header.innerHTML = headerHtml;
      //
      // let body = document.getElementById('image-modal-body');
      // let bodyHtml = '<div class="row pb-1">';
      // bodyHtml += '<div class="col-6"><span class="popup-label">Date: </span>' + feature.taken + '</div>';
      // bodyHtml += '<div class="col-6 text-end"><span class="popup-label">Location: </span>' + feature.longitude + ', ' + feature.latitude + '&nbsp;&nbsp;&nbsp;';
      // bodyHtml += '<span class="popup-label">Altitude: </span>' + feature.altitudeFeet + 'ft</div>';
      // bodyHtml += '</div>';
      //
      // switch (feature.format) {
      //   case '360':
      //     bodyHtml += '<iframe id="modal-image" className="m-0" width="100%" height="640" style="width: 100%; height: 640px; border: none; max-width: 100%; "';
      //     bodyHtml += 'frameBorder="0" allowFullScreen allow="xr-spatial-tracking; gyroscope; accelerometer" scrolling="no" ';
      //     bodyHtml += 'src="https://kuula.co/share/' + feature.kuula + '?fs=1&vr=1&zoom=1&sd=1&thumbs=1&info=0&logo=-1"></iframe>';
      //     break;
      //   case '180':
      //     bodyHtml += '<img id="modal-image" src="' + imagePath + '" width="100%">';
      //     break;
      //   default:
      //     bodyHtml += '<img id="modal-image" src="' + imagePath + '" width="100%">';
      //     break;
      // }
      // body.innerHTML = bodyHtml;
      //
      // let imageModal = new bootstrap.Modal(document.getElementById('image-modal'), {
      //   keyboard: false
      // })
      // panzoom = Panzoom(document.getElementById('modal-image'));
      // panzoom.setOptions({ minScale: 1, maxScale: 10 })
      //
      // let zoomButtons = document.getElementsByClassName('image-zoom');
      // for (let i = 0; i < zoomButtons.length; i++) {
      //   if (feature.format == '360') {
      //     zoomButtons[i].classList.add('invisible');
      //   } else {
      //     zoomButtons[i].classList.remove('invisible');
      //   }
      // }
      // imageModal.show();;
    }

  }

  openFullscreen() {

  }

  download() {

  }

}
