import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUsuario, NewUsuario } from '../usuario.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUsuario for edit and NewUsuarioFormGroupInput for create.
 */
type UsuarioFormGroupInput = IUsuario | PartialWithRequiredKeyOf<NewUsuario>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUsuario | NewUsuario> = Omit<T, 'dataCadastro' | 'ultimoAcesso'> & {
  dataCadastro?: string | null;
  ultimoAcesso?: string | null;
};

type UsuarioFormRawValue = FormValueOf<IUsuario>;

type NewUsuarioFormRawValue = FormValueOf<NewUsuario>;

type UsuarioFormDefaults = Pick<NewUsuario, 'id' | 'dataCadastro' | 'ultimoAcesso' | 'turmas' | 'cursos'>;

type UsuarioFormGroupContent = {
  id: FormControl<UsuarioFormRawValue['id'] | NewUsuario['id']>;
  nome: FormControl<UsuarioFormRawValue['nome']>;
  login: FormControl<UsuarioFormRawValue['login']>;
  senha: FormControl<UsuarioFormRawValue['senha']>;
  dataCadastro: FormControl<UsuarioFormRawValue['dataCadastro']>;
  ultimoAcesso: FormControl<UsuarioFormRawValue['ultimoAcesso']>;
  perfil: FormControl<UsuarioFormRawValue['perfil']>;
  turmas: FormControl<UsuarioFormRawValue['turmas']>;
  cursos: FormControl<UsuarioFormRawValue['cursos']>;
};

export type UsuarioFormGroup = FormGroup<UsuarioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UsuarioFormService {
  createUsuarioFormGroup(usuario: UsuarioFormGroupInput = { id: null }): UsuarioFormGroup {
    const usuarioRawValue = this.convertUsuarioToUsuarioRawValue({
      ...this.getFormDefaults(),
      ...usuario,
    });
    return new FormGroup<UsuarioFormGroupContent>({
      id: new FormControl(
        { value: usuarioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nome: new FormControl(usuarioRawValue.nome, {
        validators: [Validators.required],
      }),
      login: new FormControl(usuarioRawValue.login, {
        validators: [Validators.required],
      }),
      senha: new FormControl(usuarioRawValue.senha, {
        validators: [Validators.required],
      }),
      dataCadastro: new FormControl(usuarioRawValue.dataCadastro),
      ultimoAcesso: new FormControl(usuarioRawValue.ultimoAcesso),
      perfil: new FormControl(usuarioRawValue.perfil, {
        validators: [Validators.required],
      }),
      turmas: new FormControl(usuarioRawValue.turmas ?? []),
      cursos: new FormControl(usuarioRawValue.cursos ?? []),
    });
  }

  getUsuario(form: UsuarioFormGroup): IUsuario | NewUsuario {
    return this.convertUsuarioRawValueToUsuario(form.getRawValue() as UsuarioFormRawValue | NewUsuarioFormRawValue);
  }

  resetForm(form: UsuarioFormGroup, usuario: UsuarioFormGroupInput): void {
    const usuarioRawValue = this.convertUsuarioToUsuarioRawValue({ ...this.getFormDefaults(), ...usuario });
    form.reset(
      {
        ...usuarioRawValue,
        id: { value: usuarioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UsuarioFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataCadastro: currentTime,
      ultimoAcesso: currentTime,
      turmas: [],
      cursos: [],
    };
  }

  private convertUsuarioRawValueToUsuario(rawUsuario: UsuarioFormRawValue | NewUsuarioFormRawValue): IUsuario | NewUsuario {
    return {
      ...rawUsuario,
      dataCadastro: dayjs(rawUsuario.dataCadastro, DATE_TIME_FORMAT),
      ultimoAcesso: dayjs(rawUsuario.ultimoAcesso, DATE_TIME_FORMAT),
    };
  }

  private convertUsuarioToUsuarioRawValue(
    usuario: IUsuario | (Partial<NewUsuario> & UsuarioFormDefaults)
  ): UsuarioFormRawValue | PartialWithRequiredKeyOf<NewUsuarioFormRawValue> {
    return {
      ...usuario,
      dataCadastro: usuario.dataCadastro ? usuario.dataCadastro.format(DATE_TIME_FORMAT) : undefined,
      ultimoAcesso: usuario.ultimoAcesso ? usuario.ultimoAcesso.format(DATE_TIME_FORMAT) : undefined,
      turmas: usuario.turmas ?? [],
      cursos: usuario.cursos ?? [],
    };
  }
}
