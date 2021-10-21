import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { ConsoleComponent } from './console/console.component';
import { PopupComponent } from './popup/popup.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ConsoleComponent,
    PopupComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiaWFuY29sbGlzIiwiYSI6ImNqZXY2MHBnejBhdWUycXFjOXE1NmVyam8ifQ.4ZU6sWMHHmNzOG08U7luRQ', // Optional, can also be set per map (accessToken input of mgl-map)
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
