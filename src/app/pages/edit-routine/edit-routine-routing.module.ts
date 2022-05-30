import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRoutinePage } from './edit-routine.page';

const routes: Routes = [
  {
    path: '',
    component: EditRoutinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRoutinePageRoutingModule {}
