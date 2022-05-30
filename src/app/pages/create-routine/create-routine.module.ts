import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateRoutinePageRoutingModule } from './create-routine-routing.module';

import { CreateRoutinePage } from './create-routine.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRoutinePageRoutingModule,
    PipesModule
  ],
  declarations: [CreateRoutinePage]
})
export class CreateRoutinePageModule {}
