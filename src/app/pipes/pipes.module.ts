import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { ImagenPipe } from './imagen.pipe';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    DomSanitizerPipe,
    ImageSanitizerPipe,
    ImagenPipe
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    DomSanitizerPipe,
    ImageSanitizerPipe,
    ImagenPipe
  ]
})
export class PipesModule { }
