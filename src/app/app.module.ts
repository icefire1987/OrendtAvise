import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AviseCundaComponent } from './avise-cunda/avise-cunda.component';
import { HomeComponent } from './home/home.component';
import { NavWrapperComponent } from './nav-wrapper/nav-wrapper.component';
import { OwnMaterialModule } from './own-material/own-material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AviseCundaComponent,
    HomeComponent,
    NavWrapperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OwnMaterialModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {  }
