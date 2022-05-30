import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Admin2PageRoutingModule } from './admin2-routing.module';

import { Admin2Page } from './admin2.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Admin2PageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [Admin2Page]
})
export class Admin2PageModule {}
