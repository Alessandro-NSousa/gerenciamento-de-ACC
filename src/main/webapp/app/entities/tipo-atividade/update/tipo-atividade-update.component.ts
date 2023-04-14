import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TipoAtividadeFormService, TipoAtividadeFormGroup } from './tipo-atividade-form.service';
import { ITipoAtividade } from '../tipo-atividade.model';
import { TipoAtividadeService } from '../service/tipo-atividade.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-tipo-atividade-update',
  templateUrl: './tipo-atividade-update.component.html',
})
export class TipoAtividadeUpdateComponent implements OnInit {
  isSaving = false;
  tipoAtividade: ITipoAtividade | null = null;

  editForm: TipoAtividadeFormGroup = this.tipoAtividadeFormService.createTipoAtividadeFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected tipoAtividadeService: TipoAtividadeService,
    protected tipoAtividadeFormService: TipoAtividadeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tipoAtividade }) => {
      this.tipoAtividade = tipoAtividade;
      if (tipoAtividade) {
        this.updateForm(tipoAtividade);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('controleAccApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tipoAtividade = this.tipoAtividadeFormService.getTipoAtividade(this.editForm);
    if (tipoAtividade.id !== null) {
      this.subscribeToSaveResponse(this.tipoAtividadeService.update(tipoAtividade));
    } else {
      this.subscribeToSaveResponse(this.tipoAtividadeService.create(tipoAtividade));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITipoAtividade>>): void {
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

  protected updateForm(tipoAtividade: ITipoAtividade): void {
    this.tipoAtividade = tipoAtividade;
    this.tipoAtividadeFormService.resetForm(this.editForm, tipoAtividade);
  }
}
