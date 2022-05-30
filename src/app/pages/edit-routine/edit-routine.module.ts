import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRoutinePageRoutingModule } from './edit-routine-routing.module';

import { EditRoutinePage } from './edit-routine.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    EditRoutinePageRoutingModule
  ],
  declarations: [EditRoutinePage]
})
export class EditRoutinePageModule {}
