import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from './pipes/pipes.module';
import { Camera } from '@ionic-native/camera/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx'
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, RouterModule ,PipesModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
              Camera,
              FileTransfer],
  bootstrap: [AppComponent],
})
export class AppModule {}
