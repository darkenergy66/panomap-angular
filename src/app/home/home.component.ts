import {Component, OnDestroy, OnInit, ChangeDetectorRef, ElementRef, ViewChild} from '@angular/core';
import { ImageDataService } from '../image-data.service';
import { Maps, Map } from '../maps-list.interface';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { GeoJSONSource, Map as MapboxMap, MapLayerMouseEvent, MapMouseEvent, Marker } from 'mapbox-gl';
import { ImageFormat } from '../environment.interface';
import { Feature } from "../images-geojson.interface";
import panzoom from "panzoom";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faSearchMinus, faSearchPlus, faArrowsAlt, faDownload, faTimes, faAsterisk } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  faSearchMinus = faSearchMinus;
  faSearchPlus = faSearchPlus;
  faArrowsAlt = faArrowsAlt;
  faDownload = faDownload;
  faTimes = faTimes;
  faAsterisk = faAsterisk;

  mapParams = environment.init.map;
  formats: ImageFormat[] = environment.imageFormats;
  key: string | null = '';
  thisMap: Map | null = null;
  map: MapboxMap | null = null;
  formatKeys: any[] = [];
  markerImagesLoaded = false;
  cursorStyle = 'default';
  SPIDERFY_FROM_ZOOM = 10;
  popupFeature: GeoJSON.Feature<GeoJSON.Point> | undefined = undefined;
  popupHtml = '';
  currentImage: any;
  imagePath = '';
  kuulaUrl: SafeResourceUrl = '';
  format: ImageFormat | null = null;

  mapsSubscription: Subscription;

  @ViewChild('imageModal') imageModal: ElementRef | undefined;

  constructor(
    private imageData: ImageDataService,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private elementRef: ElementRef,
    private modalService: NgbModal,
    private dom:DomSanitizer,
    private http: HttpClient,
  )
  {

    // this.formatKeys = Object.keys(this.formats);
    for (let i=0; i<this.formats.length; i++ ) {
      this.formatKeys.push(this.formats[i].key);
    }

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
    // console.log('this.map>>', this.map);
    // console.log('>>2>>>', this.map?.getStyle().layers);
  }

  showMap() {
    // console.log('>>1>>>', this.map?.getStyle().layers);

    this.map?.on('idle', () => {
      // map.getCanvas().toDataURL()
      // console.log('>>1b>>>', this.map?.getStyle().layers);
      this.map?.moveLayer('raster-layer-RGB-iancollis-8iwnwpnb', 'clusters');

    });

    if (this.thisMap)
      this.mapParams['center'] = this.thisMap?.mapbox.center || environment.init.map.center;
      this.mapParams['zoom'] = this.thisMap?.mapbox.zoom || environment.init.map.zoom;
      this.mapParams['style'] = this.thisMap?.mapbox.style || environment.init.map.style;
  }

  imageLoaded(key: any, testId: any) {
    // console.log('loaded', key, 'formatKeys', this.formatKeys, 'id', testId);
    const index = this.formatKeys.indexOf(key);
    if (index > -1) {
      this.formatKeys.splice(index, 1);
    }
    if (this.formatKeys.length === 0) {
      this.markerImagesLoaded = true;
      // console.log('Marker images loaded');
    }
  }

  imageClick(e: MapLayerMouseEvent) {
    const features: any = this.map?.queryRenderedFeatures(e.point, {
      layers: ['markers']
    });
    if (!features?.length) {
      return;
    } else {
      this.imageModal?.nativeElement.click();
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

                const thisFormat = this.getFormat(feature?.properties?.format);

                html += '<li class="cluster-popup-list-item">';
                // @ts-ignore
                html += '<img src="' + thisFormat.icon + '">';
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
    // console.log('imageModal', this.imageModal);
    this.imageModal?.nativeElement.click();
    this.buildModal(feature);

    // this.buildModal(feature);
    // this.elementRef.nativeElement.querySelector('.cluster-popup-list-item').removeEventListener('click', this.onFeatureClick);
  }

  buildModal(feature: any) {

    this.currentImage = feature?.properties;
    this.imagePath = environment.imagesBaseUrl + this.key + '/' + this.currentImage.id + ".jpg";
    this.format = this.getFormat(this.currentImage.format);
    this.kuulaUrl = this.dom.bypassSecurityTrustResourceUrl('https://kuula.co/share/' + this.currentImage.kuula
      + '?fs=1&vr=1&zoom=1&sd=1&thumbs=1&info=0&logo=-1');

    console.log('this.currentImage', this.currentImage);
    console.log('this.key', this.key);
    console.log('this.imagePath', this.imagePath);
    console.log('this.format', this.format);
    console.log('this.formats', this.formats);
    console.log('this.kuulaUrl', this.kuulaUrl);






    // let imagePath = environment.imagesBaseUrl + this.key + '/' + feature.properties.id + ".jpg";
    // let imageTitle = feature.properties.id + ".jpg";
    // let downloadFile = imagePath;
    //
    // let header = document.getElementById('image-modal-header');
    // if (header) {
    //
    //   const props = feature.properties;
    //
    //   const isThisFormat = ( element: ImageFormat ) => element.key == props.format;
    //   const thisFormat = this.formats[this.formats.findIndex(isThisFormat)];
    //
    //   let headerHtml = '<img src="' + thisFormat.icon + '"><h5>' + thisFormat.name + '</h5>';
    //
    //   headerHtml += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
    //   header.innerHTML = headerHtml;
    //
    //   let body = document.getElementById('image-modal-body');
    //   let bodyHtml = '<div class="row pb-1">';
    //   bodyHtml += '<div class="col-6"><span class="popup-label">Date: </span>' + props.taken + '</div>';
    //   bodyHtml += '<div class="col-6 text-end"><span class="popup-label">Location: </span>' + props.longitude + ', ' + props.latitude + '&nbsp;&nbsp;&nbsp;';
    //   bodyHtml += '<span class="popup-label">Altitude: </span>' + props.altitudeFeet + 'ft</div>';
    //   bodyHtml += '</div>';
    //
    //   console.log('headerHtml', bodyHtml, props.format);
    //
    //   switch (props.format) {
    //     case '360':
    //       bodyHtml += '<iframe id="modal-image" className="m-0" width="100%" height="640" style="width: 100%; height: 640px; border: none; max-width: 100%; "';
    //       bodyHtml += 'frameBorder="0" allowFullScreen allow="xr-spatial-tracking; gyroscope; accelerometer" scrolling="no" ';
    //       bodyHtml += 'src="https://kuula.co/share/' + props.kuula + '?fs=1&vr=1&zoom=1&sd=1&thumbs=1&info=0&logo=-1"></iframe>';
    //       break;
    //     case '180':
    //       bodyHtml += '<img id="modal-image" src="' + imagePath + '" width="100%">';
    //       break;
    //     default:
    //       bodyHtml += '<img id="modal-image" src="' + imagePath + '" width="100%">';
    //       break;
    //   }

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
      // imageModal.show();
    // }

  }

  getFormat(formatId: string) {
    const isThisFormat = ( element: ImageFormat ) => element.key == formatId;
    return this.formats[this.formats.findIndex(isThisFormat)];
  }

  openFullscreen() {
     const docElmWithBrowsersFullScreenFunctions = document.getElementById("modalImage") as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };

    if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
      docElmWithBrowsersFullScreenFunctions.requestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
      docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
    } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
      docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
    }
  }




  download() {
    this.http.get(this.imagePath, { responseType: 'blob' }).subscribe( val => {
      const url = URL.createObjectURL(val);
      const a: any = document.createElement('a');
      a.href = url;
      a.download = '';
      document.body.appendChild(a);
      a.style = 'display: none';
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  };

  zoomIn() {

  }

  zoomOut() {

  }

  resetZoom() {

  }

  open(content: any) {
    const options = {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      centered: true,
      backdrop: true,
      animation: true
    }
    this.modalService.open(content, options).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
