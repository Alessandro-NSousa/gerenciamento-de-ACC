import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICertificado, NewCertificado } from '../certificado.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICertificado for edit and NewCertificadoFormGroupInput for create.
 */
type CertificadoFormGroupInput = ICertificado | PartialWithRequiredKeyOf<NewCertificado>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICertificado | NewCertificado> = Omit<T, 'dataDeEnvio'> & {
  dataDeEnvio?: string | null;
};

type CertificadoFormRawValue = FormValueOf<ICertificado>;

type NewCertificadoFormRawValue = FormValueOf<NewCertificado>;

type CertificadoFormDefaults = Pick<NewCertificado, 'id' | 'dataDeEnvio'>;

type CertificadoFormGroupContent = {
  id: FormControl<CertificadoFormRawValue['id'] | NewCertificado['id']>;
  titulo: FormControl<CertificadoFormRawValue['titulo']>;
  descricao: FormControl<CertificadoFormRawValue['descricao']>;
  dataDeEnvio: FormControl<CertificadoFormRawValue['dataDeEnvio']>;
  observacao: FormControl<CertificadoFormRawValue['observacao']>;
  modalidade: FormControl<CertificadoFormRawValue['modalidade']>;
  chCuprida: FormControl<CertificadoFormRawValue['chCuprida']>;
  pontuacao: FormControl<CertificadoFormRawValue['pontuacao']>;
  status: FormControl<CertificadoFormRawValue['status']>;
  caminhoDoArquivo: FormControl<CertificadoFormRawValue['caminhoDoArquivo']>;
  usuario: FormControl<CertificadoFormRawValue['usuario']>;
  turmaAcc: FormControl<CertificadoFormRawValue['turmaAcc']>;
  tipoAtividade: FormControl<CertificadoFormRawValue['tipoAtividade']>;
};

export type CertificadoFormGroup = FormGroup<CertificadoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CertificadoFormService {
  createCertificadoFormGroup(certificado: CertificadoFormGroupInput = { id: null }): CertificadoFormGroup {
    const certificadoRawValue = this.convertCertificadoToCertificadoRawValue({
      ...this.getFormDefaults(),
      ...certificado,
    });
    return new FormGroup<CertificadoFormGroupContent>({
      id: new FormControl(
        { value: certificadoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      titulo: new FormControl(certificadoRawValue.titulo),
      descricao: new FormControl(certificadoRawValue.descricao),
      dataDeEnvio: new FormControl(certificadoRawValue.dataDeEnvio),
      observacao: new FormControl(certificadoRawValue.observacao),
      modalidade: new FormControl(certificadoRawValue.modalidade),
      chCuprida: new FormControl(certificadoRawValue.chCuprida),
      pontuacao: new FormControl(certificadoRawValue.pontuacao),
      status: new FormControl(certificadoRawValue.status),
      caminhoDoArquivo: new FormControl(certificadoRawValue.caminhoDoArquivo),
      usuario: new FormControl(certificadoRawValue.usuario),
      turmaAcc: new FormControl(certificadoRawValue.turmaAcc),
      tipoAtividade: new FormControl(certificadoRawValue.tipoAtividade),
    });
  }

  getCertificado(form: CertificadoFormGroup): ICertificado | NewCertificado {
    return this.convertCertificadoRawValueToCertificado(form.getRawValue() as CertificadoFormRawValue | NewCertificadoFormRawValue);
  }

  resetForm(form: CertificadoFormGroup, certificado: CertificadoFormGroupInput): void {
    const certificadoRawValue = this.convertCertificadoToCertificadoRawValue({ ...this.getFormDefaults(), ...certificado });
    form.reset(
      {
        ...certificadoRawValue,
        id: { value: certificadoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CertificadoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataDeEnvio: currentTime,
    };
  }

  private convertCertificadoRawValueToCertificado(
    rawCertificado: CertificadoFormRawValue | NewCertificadoFormRawValue
  ): ICertificado | NewCertificado {
    return {
      ...rawCertificado,
      dataDeEnvio: dayjs(rawCertificado.dataDeEnvio, DATE_TIME_FORMAT),
    };
  }

  private convertCertificadoToCertificadoRawValue(
    certificado: ICertificado | (Partial<NewCertificado> & CertificadoFormDefaults)
  ): CertificadoFormRawValue | PartialWithRequiredKeyOf<NewCertificadoFormRawValue> {
    return {
      ...certificado,
      dataDeEnvio: certificado.dataDeEnvio ? certificado.dataDeEnvio.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
