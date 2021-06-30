import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { MapComponent } from './map/map.component';
import { ConsoleComponent } from './console/console.component';
import { PopupComponent } from './popup/popup.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ConsoleComponent,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1Ijoic29jcmF0YSIsImEiOiJjaXJxc2wzam0waGU5ZmZtODhqd2ttamdxIn0.1ZQEByXoDD7fGIa9lUHIqg', // Optional, can also be set per map (accessToken input of mgl-map)
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
