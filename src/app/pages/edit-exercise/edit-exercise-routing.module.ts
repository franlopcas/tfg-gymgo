import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditExercisePage } from './edit-exercise.page';

const routes: Routes = [
  {
    path: '',
    component: EditExercisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditExercisePageRoutingModule {}
