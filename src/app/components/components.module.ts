import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AvatarSelectorComponent } from './avatar-selector/avatar-selector.component';
import { SearchComponent } from './search/search.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';
import { FavouritesComponent } from './favourites/favourites.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { TableComponent } from './table/table.component';
import { RoutineComponent } from './routine/routine.component';



@NgModule({
  declarations: [
    AvatarSelectorComponent,
    SearchComponent,
    FavouritesComponent,
    ExerciseComponent,
    RoutineComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    PipesModule
  ],
  exports: [
    AvatarSelectorComponent,
    SearchComponent,
    FavouritesComponent,
    ExerciseComponent,
    RoutineComponent,
    TableComponent
  ]
})
export class ComponentsModule { }
