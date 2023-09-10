import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'tarefas',
    loadChildren: () => import('./tarefas/tarefas.module').then( m => m.TarefasPageModule)
  },
  {
    path: 'nova-tarefa',
    loadChildren: () => import('./nova-tarefa/nova-tarefa.module').then( m => m.NovaTarefaPageModule)
  },
  {
    path: 'editar-tarefa',
    loadChildren: () => import('./editar-tarefa/editar-tarefa.module').then( m => m.EditarTarefaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
