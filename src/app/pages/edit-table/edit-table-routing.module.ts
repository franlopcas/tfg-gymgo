import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTablePage } from './edit-table.page';

const routes: Routes = [
  {
    path: '',
    component: EditTablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTablePageRoutingModule {}
