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
    path: 'tarefas/:cod_usuario',
    loadChildren: () => import('./tarefas/tarefas.module').then( m => m.TarefasPageModule)
  },
  {
    path: 'nova-tarefa/:cod_usuario',
    loadChildren: () => import('./nova-tarefa/nova-tarefa.module').then( m => m.NovaTarefaPageModule)
  },
  {
    path: 'editar-tarefa/:cod_tarefa',
    loadChildren: () => import('./editar-tarefa/editar-tarefa.module').then( m => m.EditarTarefaPageModule)
  },
  {
    path: 'novo-usuario',
    loadChildren: () => import('./novo-usuario/novo-usuario.module').then( m => m.NovoUsuarioPageModule)
  },
  {
    path: 'editar-usuario/:cod_usuario',
    loadChildren: () => import('./editar-usuario/editar-usuario.module').then( m => m.EditarUsuarioPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
