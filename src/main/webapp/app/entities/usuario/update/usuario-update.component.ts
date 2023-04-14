import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UsuarioFormService, UsuarioFormGroup } from './usuario-form.service';
import { IUsuario } from '../usuario.model';
import { UsuarioService } from '../service/usuario.service';
import { ITurmaACC } from 'app/entities/turma-acc/turma-acc.model';
import { TurmaACCService } from 'app/entities/turma-acc/service/turma-acc.service';
import { ICurso } from 'app/entities/curso/curso.model';
import { CursoService } from 'app/entities/curso/service/curso.service';
import { Perfil } from 'app/entities/enumerations/perfil.model';

@Component({
  selector: 'jhi-usuario-update',
  templateUrl: './usuario-update.component.html',
})
export class UsuarioUpdateComponent implements OnInit {
  isSaving = false;
  usuario: IUsuario | null = null;
  perfilValues = Object.keys(Perfil);

  turmaACCSSharedCollection: ITurmaACC[] = [];
  cursosSharedCollection: ICurso[] = [];

  editForm: UsuarioFormGroup = this.usuarioFormService.createUsuarioFormGroup();

  constructor(
    protected usuarioService: UsuarioService,
    protected usuarioFormService: UsuarioFormService,
    protected turmaACCService: TurmaACCService,
    protected cursoService: CursoService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTurmaACC = (o1: ITurmaACC | null, o2: ITurmaACC | null): boolean => this.turmaACCService.compareTurmaACC(o1, o2);

  compareCurso = (o1: ICurso | null, o2: ICurso | null): boolean => this.cursoService.compareCurso(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuario }) => {
      this.usuario = usuario;
      if (usuario) {
        this.updateForm(usuario);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usuario = this.usuarioFormService.getUsuario(this.editForm);
    if (usuario.id !== null) {
      this.subscribeToSaveResponse(this.usuarioService.update(usuario));
    } else {
      this.subscribeToSaveResponse(this.usuarioService.create(usuario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsuario>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(usuario: IUsuario): void {
    this.usuario = usuario;
    this.usuarioFormService.resetForm(this.editForm, usuario);

    this.turmaACCSSharedCollection = this.turmaACCService.addTurmaACCToCollectionIfMissing<ITurmaACC>(
      this.turmaACCSSharedCollection,
      ...(usuario.turmas ?? [])
    );
    this.cursosSharedCollection = this.cursoService.addCursoToCollectionIfMissing<ICurso>(
      this.cursosSharedCollection,
      ...(usuario.cursos ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.turmaACCService
      .query()
      .pipe(map((res: HttpResponse<ITurmaACC[]>) => res.body ?? []))
      .pipe(
        map((turmaACCS: ITurmaACC[]) =>
          this.turmaACCService.addTurmaACCToCollectionIfMissing<ITurmaACC>(turmaACCS, ...(this.usuario?.turmas ?? []))
        )
      )
      .subscribe((turmaACCS: ITurmaACC[]) => (this.turmaACCSSharedCollection = turmaACCS));

    this.cursoService
      .query()
      .pipe(map((res: HttpResponse<ICurso[]>) => res.body ?? []))
      .pipe(map((cursos: ICurso[]) => this.cursoService.addCursoToCollectionIfMissing<ICurso>(cursos, ...(this.usuario?.cursos ?? []))))
      .subscribe((cursos: ICurso[]) => (this.cursosSharedCollection = cursos));
  }
}
