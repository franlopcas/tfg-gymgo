import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutinePageRoutingModule } from './routine-routing.module';

import { RoutinePage } from './routine.page';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    RoutinePageRoutingModule,
    PipesModule
  ],
  declarations: [RoutinePage]
})
export class RoutinePageModule {}
