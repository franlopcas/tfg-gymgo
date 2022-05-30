import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateExercisePageRoutingModule } from './create-exercise-routing.module';

import { CreateExercisePage } from './create-exercise.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CreateExercisePageRoutingModule,
    PipesModule
  ],
  declarations: [CreateExercisePage]
})
export class CreateExercisePageModule {}
