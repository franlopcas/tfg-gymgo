import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Admin1PageRoutingModule } from './admin1-routing.module';

import { Admin1Page } from './admin1.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    Admin1PageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [Admin1Page]
})
export class Admin1PageModule {}
