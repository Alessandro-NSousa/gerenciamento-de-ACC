import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITurmaACC, NewTurmaACC } from '../turma-acc.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITurmaACC for edit and NewTurmaACCFormGroupInput for create.
 */
type TurmaACCFormGroupInput = ITurmaACC | PartialWithRequiredKeyOf<NewTurmaACC>;

type TurmaACCFormDefaults = Pick<NewTurmaACC, 'id' | 'usuarios' | 'cursos'>;

type TurmaACCFormGroupContent = {
  id: FormControl<ITurmaACC['id'] | NewTurmaACC['id']>;
  nome: FormControl<ITurmaACC['nome']>;
  inicio: FormControl<ITurmaACC['inicio']>;
  termino: FormControl<ITurmaACC['termino']>;
  usuarios: FormControl<ITurmaACC['usuarios']>;
  cursos: FormControl<ITurmaACC['cursos']>;
};

export type TurmaACCFormGroup = FormGroup<TurmaACCFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TurmaACCFormService {
  createTurmaACCFormGroup(turmaACC: TurmaACCFormGroupInput = { id: null }): TurmaACCFormGroup {
    const turmaACCRawValue = {
      ...this.getFormDefaults(),
      ...turmaACC,
    };
    return new FormGroup<TurmaACCFormGroupContent>({
      id: new FormControl(
        { value: turmaACCRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nome: new FormControl(turmaACCRawValue.nome, {
        validators: [Validators.required],
      }),
      inicio: new FormControl(turmaACCRawValue.inicio),
      termino: new FormControl(turmaACCRawValue.termino),
      usuarios: new FormControl(turmaACCRawValue.usuarios ?? []),
      cursos: new FormControl(turmaACCRawValue.cursos ?? []),
    });
  }

  getTurmaACC(form: TurmaACCFormGroup): ITurmaACC | NewTurmaACC {
    return form.getRawValue() as ITurmaACC | NewTurmaACC;
  }

  resetForm(form: TurmaACCFormGroup, turmaACC: TurmaACCFormGroupInput): void {
    const turmaACCRawValue = { ...this.getFormDefaults(), ...turmaACC };
    form.reset(
      {
        ...turmaACCRawValue,
        id: { value: turmaACCRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TurmaACCFormDefaults {
    return {
      id: null,
      usuarios: [],
      cursos: [],
    };
  }
}
