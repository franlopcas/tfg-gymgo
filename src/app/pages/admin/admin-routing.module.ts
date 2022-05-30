import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminPage,
    children: [
      {
        path: 'admin1',
        loadChildren: () => import('../admin1/admin1.module').then(m => m.Admin1PageModule)
      },
      {
        path: 'admin2',
        loadChildren: () => import('../admin2/admin2.module').then(m => m.Admin2PageModule)
      },
      {
        path: '',
        redirectTo: '/admin/admin1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/admin/admin1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
