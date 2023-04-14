import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CertificadoFormService, CertificadoFormGroup } from './certificado-form.service';
import { ICertificado } from '../certificado.model';
import { CertificadoService } from '../service/certificado.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { ITurmaACC } from 'app/entities/turma-acc/turma-acc.model';
import { TurmaACCService } from 'app/entities/turma-acc/service/turma-acc.service';
import { ITipoAtividade } from 'app/entities/tipo-atividade/tipo-atividade.model';
import { TipoAtividadeService } from 'app/entities/tipo-atividade/service/tipo-atividade.service';
import { Modalidade } from 'app/entities/enumerations/modalidade.model';
import { StatusCertificado } from 'app/entities/enumerations/status-certificado.model';

@Component({
  selector: 'jhi-certificado-update',
  templateUrl: './certificado-update.component.html',
})
export class CertificadoUpdateComponent implements OnInit {
  isSaving = false;
  certificado: ICertificado | null = null;
  modalidadeValues = Object.keys(Modalidade);
  statusCertificadoValues = Object.keys(StatusCertificado);

  usuariosSharedCollection: IUsuario[] = [];
  turmaACCSSharedCollection: ITurmaACC[] = [];
  tipoAtividadesSharedCollection: ITipoAtividade[] = [];

  editForm: CertificadoFormGroup = this.certificadoFormService.createCertificadoFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected certificadoService: CertificadoService,
    protected certificadoFormService: CertificadoFormService,
    protected usuarioService: UsuarioService,
    protected turmaACCService: TurmaACCService,
    protected tipoAtividadeService: TipoAtividadeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  compareTurmaACC = (o1: ITurmaACC | null, o2: ITurmaACC | null): boolean => this.turmaACCService.compareTurmaACC(o1, o2);

  compareTipoAtividade = (o1: ITipoAtividade | null, o2: ITipoAtividade | null): boolean =>
    this.tipoAtividadeService.compareTipoAtividade(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ certificado }) => {
      this.certificado = certificado;
      if (certificado) {
        this.updateForm(certificado);
      }

      this.loadRelationshipsOptions();
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
    const certificado = this.certificadoFormService.getCertificado(this.editForm);
    if (certificado.id !== null) {
      this.subscribeToSaveResponse(this.certificadoService.update(certificado));
    } else {
      this.subscribeToSaveResponse(this.certificadoService.create(certificado));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICertificado>>): void {
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

  protected updateForm(certificado: ICertificado): void {
    this.certificado = certificado;
    this.certificadoFormService.resetForm(this.editForm, certificado);

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      certificado.usuario
    );
    this.turmaACCSSharedCollection = this.turmaACCService.addTurmaACCToCollectionIfMissing<ITurmaACC>(
      this.turmaACCSSharedCollection,
      certificado.turmaAcc
    );
    this.tipoAtividadesSharedCollection = this.tipoAtividadeService.addTipoAtividadeToCollectionIfMissing<ITipoAtividade>(
      this.tipoAtividadesSharedCollection,
      certificado.tipoAtividade
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.certificado?.usuario))
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));

    this.turmaACCService
      .query()
      .pipe(map((res: HttpResponse<ITurmaACC[]>) => res.body ?? []))
      .pipe(
        map((turmaACCS: ITurmaACC[]) =>
          this.turmaACCService.addTurmaACCToCollectionIfMissing<ITurmaACC>(turmaACCS, this.certificado?.turmaAcc)
        )
      )
      .subscribe((turmaACCS: ITurmaACC[]) => (this.turmaACCSSharedCollection = turmaACCS));

    this.tipoAtividadeService
      .query()
      .pipe(map((res: HttpResponse<ITipoAtividade[]>) => res.body ?? []))
      .pipe(
        map((tipoAtividades: ITipoAtividade[]) =>
          this.tipoAtividadeService.addTipoAtividadeToCollectionIfMissing<ITipoAtividade>(tipoAtividades, this.certificado?.tipoAtividade)
        )
      )
      .subscribe((tipoAtividades: ITipoAtividade[]) => (this.tipoAtividadesSharedCollection = tipoAtividades));
  }
}
