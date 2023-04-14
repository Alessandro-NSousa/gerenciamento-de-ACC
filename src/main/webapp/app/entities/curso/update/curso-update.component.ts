import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CursoFormService, CursoFormGroup } from './curso-form.service';
import { ICurso } from '../curso.model';
import { CursoService } from '../service/curso.service';
import { ITurmaACC } from 'app/entities/turma-acc/turma-acc.model';
import { TurmaACCService } from 'app/entities/turma-acc/service/turma-acc.service';

@Component({
  selector: 'jhi-curso-update',
  templateUrl: './curso-update.component.html',
})
export class CursoUpdateComponent implements OnInit {
  isSaving = false;
  curso: ICurso | null = null;

  turmaACCSSharedCollection: ITurmaACC[] = [];

  editForm: CursoFormGroup = this.cursoFormService.createCursoFormGroup();

  constructor(
    protected cursoService: CursoService,
    protected cursoFormService: CursoFormService,
    protected turmaACCService: TurmaACCService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTurmaACC = (o1: ITurmaACC | null, o2: ITurmaACC | null): boolean => this.turmaACCService.compareTurmaACC(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ curso }) => {
      this.curso = curso;
      if (curso) {
        this.updateForm(curso);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const curso = this.cursoFormService.getCurso(this.editForm);
    if (curso.id !== null) {
      this.subscribeToSaveResponse(this.cursoService.update(curso));
    } else {
      this.subscribeToSaveResponse(this.cursoService.create(curso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICurso>>): void {
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

  protected updateForm(curso: ICurso): void {
    this.curso = curso;
    this.cursoFormService.resetForm(this.editForm, curso);

    this.turmaACCSSharedCollection = this.turmaACCService.addTurmaACCToCollectionIfMissing<ITurmaACC>(
      this.turmaACCSSharedCollection,
      ...(curso.turmas ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.turmaACCService
      .query()
      .pipe(map((res: HttpResponse<ITurmaACC[]>) => res.body ?? []))
      .pipe(
        map((turmaACCS: ITurmaACC[]) =>
          this.turmaACCService.addTurmaACCToCollectionIfMissing<ITurmaACC>(turmaACCS, ...(this.curso?.turmas ?? []))
        )
      )
      .subscribe((turmaACCS: ITurmaACC[]) => (this.turmaACCSSharedCollection = turmaACCS));
  }
}
