import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITipoAtividade, NewTipoAtividade } from '../tipo-atividade.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITipoAtividade for edit and NewTipoAtividadeFormGroupInput for create.
 */
type TipoAtividadeFormGroupInput = ITipoAtividade | PartialWithRequiredKeyOf<NewTipoAtividade>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITipoAtividade | NewTipoAtividade> = Omit<T, 'dataCriacao'> & {
  dataCriacao?: string | null;
};

type TipoAtividadeFormRawValue = FormValueOf<ITipoAtividade>;

type NewTipoAtividadeFormRawValue = FormValueOf<NewTipoAtividade>;

type TipoAtividadeFormDefaults = Pick<NewTipoAtividade, 'id' | 'dataCriacao'>;

type TipoAtividadeFormGroupContent = {
  id: FormControl<TipoAtividadeFormRawValue['id'] | NewTipoAtividade['id']>;
  nome: FormControl<TipoAtividadeFormRawValue['nome']>;
  descricao: FormControl<TipoAtividadeFormRawValue['descricao']>;
  numeroDePontos: FormControl<TipoAtividadeFormRawValue['numeroDePontos']>;
  dataCriacao: FormControl<TipoAtividadeFormRawValue['dataCriacao']>;
};

export type TipoAtividadeFormGroup = FormGroup<TipoAtividadeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TipoAtividadeFormService {
  createTipoAtividadeFormGroup(tipoAtividade: TipoAtividadeFormGroupInput = { id: null }): TipoAtividadeFormGroup {
    const tipoAtividadeRawValue = this.convertTipoAtividadeToTipoAtividadeRawValue({
      ...this.getFormDefaults(),
      ...tipoAtividade,
    });
    return new FormGroup<TipoAtividadeFormGroupContent>({
      id: new FormControl(
        { value: tipoAtividadeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nome: new FormControl(tipoAtividadeRawValue.nome, {
        validators: [Validators.required],
      }),
      descricao: new FormControl(tipoAtividadeRawValue.descricao),
      numeroDePontos: new FormControl(tipoAtividadeRawValue.numeroDePontos),
      dataCriacao: new FormControl(tipoAtividadeRawValue.dataCriacao),
    });
  }

  getTipoAtividade(form: TipoAtividadeFormGroup): ITipoAtividade | NewTipoAtividade {
    return this.convertTipoAtividadeRawValueToTipoAtividade(form.getRawValue() as TipoAtividadeFormRawValue | NewTipoAtividadeFormRawValue);
  }

  resetForm(form: TipoAtividadeFormGroup, tipoAtividade: TipoAtividadeFormGroupInput): void {
    const tipoAtividadeRawValue = this.convertTipoAtividadeToTipoAtividadeRawValue({ ...this.getFormDefaults(), ...tipoAtividade });
    form.reset(
      {
        ...tipoAtividadeRawValue,
        id: { value: tipoAtividadeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TipoAtividadeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataCriacao: currentTime,
    };
  }

  private convertTipoAtividadeRawValueToTipoAtividade(
    rawTipoAtividade: TipoAtividadeFormRawValue | NewTipoAtividadeFormRawValue
  ): ITipoAtividade | NewTipoAtividade {
    return {
      ...rawTipoAtividade,
      dataCriacao: dayjs(rawTipoAtividade.dataCriacao, DATE_TIME_FORMAT),
    };
  }

  private convertTipoAtividadeToTipoAtividadeRawValue(
    tipoAtividade: ITipoAtividade | (Partial<NewTipoAtividade> & TipoAtividadeFormDefaults)
  ): TipoAtividadeFormRawValue | PartialWithRequiredKeyOf<NewTipoAtividadeFormRawValue> {
    return {
      ...tipoAtividade,
      dataCriacao: tipoAtividade.dataCriacao ? tipoAtividade.dataCriacao.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
