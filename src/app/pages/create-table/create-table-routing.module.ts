import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTablePage } from './create-table.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTablePageRoutingModule {}
