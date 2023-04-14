import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'usuario',
        data: { pageTitle: 'controleAccApp.usuario.home.title' },
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      {
        path: 'certificado',
        data: { pageTitle: 'controleAccApp.certificado.home.title' },
        loadChildren: () => import('./certificado/certificado.module').then(m => m.CertificadoModule),
      },
      {
        path: 'turma-acc',
        data: { pageTitle: 'controleAccApp.turmaACC.home.title' },
        loadChildren: () => import('./turma-acc/turma-acc.module').then(m => m.TurmaACCModule),
      },
      {
        path: 'curso',
        data: { pageTitle: 'controleAccApp.curso.home.title' },
        loadChildren: () => import('./curso/curso.module').then(m => m.CursoModule),
      },
      {
        path: 'tipo-atividade',
        data: { pageTitle: 'controleAccApp.tipoAtividade.home.title' },
        loadChildren: () => import('./tipo-atividade/tipo-atividade.module').then(m => m.TipoAtividadeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
