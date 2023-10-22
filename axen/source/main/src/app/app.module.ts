import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageLoaderComponent,
    MainLayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgScrollbarModule,
    ReactiveFormsModule,
    LoadingBarRouterModule,
    // core & shared
    CoreModule,
    SharedModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
