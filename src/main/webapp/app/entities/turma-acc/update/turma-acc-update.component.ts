import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TurmaACCFormService, TurmaACCFormGroup } from './turma-acc-form.service';
import { ITurmaACC } from '../turma-acc.model';
import { TurmaACCService } from '../service/turma-acc.service';

@Component({
  selector: 'jhi-turma-acc-update',
  templateUrl: './turma-acc-update.component.html',
})
export class TurmaACCUpdateComponent implements OnInit {
  isSaving = false;
  turmaACC: ITurmaACC | null = null;

  editForm: TurmaACCFormGroup = this.turmaACCFormService.createTurmaACCFormGroup();

  constructor(
    protected turmaACCService: TurmaACCService,
    protected turmaACCFormService: TurmaACCFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ turmaACC }) => {
      this.turmaACC = turmaACC;
      if (turmaACC) {
        this.updateForm(turmaACC);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const turmaACC = this.turmaACCFormService.getTurmaACC(this.editForm);
    if (turmaACC.id !== null) {
      this.subscribeToSaveResponse(this.turmaACCService.update(turmaACC));
    } else {
      this.subscribeToSaveResponse(this.turmaACCService.create(turmaACC));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITurmaACC>>): void {
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

  protected updateForm(turmaACC: ITurmaACC): void {
    this.turmaACC = turmaACC;
    this.turmaACCFormService.resetForm(this.editForm, turmaACC);
  }
}
