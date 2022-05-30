import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Admin1Page } from './admin1.page';

const routes: Routes = [
  {
    path: '',
    component: Admin1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Admin1PageRoutingModule {}
