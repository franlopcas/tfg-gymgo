import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioGuard } from './guards/usuario.guard';

const routes: Routes = [
  {
    path: 'main',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [UsuarioGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main/tabs/tab2'
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'edit-exercise/:_id',
    loadChildren: () => import('./pages/edit-exercise/edit-exercise.module').then( m => m.EditExercisePageModule),
    canLoad: [UsuarioGuard]
  },
  {
    path: 'create-exercise',
    loadChildren: () => import('./pages/create-exercise/create-exercise.module').then( m => m.CreateExercisePageModule),
    canLoad: [UsuarioGuard]
  },
  {
    path: 'create-routine/:_id',
    loadChildren: () => import('./pages/create-routine/create-routine.module').then( m => m.CreateRoutinePageModule),
    canLoad: [UsuarioGuard]
  },
  {
    path: 'edit-routine/:_id',
    loadChildren: () => import('./pages/edit-routine/edit-routine.module').then( m => m.EditRoutinePageModule),
    canLoad: [UsuarioGuard]
  },
  {
    path: 'create-table/:_id',
    loadChildren: () => import('./pages/create-table/create-table.module').then( m => m.CreateTablePageModule)
  },
  {
    path: 'edit-table/:_id',
    loadChildren: () => import('./pages/edit-table/edit-table.module').then( m => m.EditTablePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
