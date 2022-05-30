import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Admin2Page } from './admin2.page';

const routes: Routes = [
  {
    path: '',
    component: Admin2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Admin2PageRoutingModule {}
