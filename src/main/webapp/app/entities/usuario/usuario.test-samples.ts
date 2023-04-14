import dayjs from 'dayjs/esm';

import { Perfil } from 'app/entities/enumerations/perfil.model';

import { IUsuario, NewUsuario } from './usuario.model';

export const sampleWithRequiredData: IUsuario = {
  id: 19585,
  nome: 'cross-platform',
  login: 'knowledge Accounts Berkshire',
  senha: 'SAS',
  perfil: Perfil['DISCENTE'],
};

export const sampleWithPartialData: IUsuario = {
  id: 68191,
  nome: 'Officer internet',
  login: 'Savings Bacon open',
  senha: 'Tenge',
  perfil: Perfil['ORIENTADOR'],
};

export const sampleWithFullData: IUsuario = {
  id: 70702,
  nome: 'East IB Dollar',
  login: 'migration',
  senha: 'Senior prata',
  dataCadastro: dayjs('2023-04-13T00:38'),
  ultimoAcesso: dayjs('2023-04-13T14:20'),
  perfil: Perfil['COORDENADOR'],
};

export const sampleWithNewData: NewUsuario = {
  nome: 'Jóias Functionality',
  login: 'Lindo Congelado Fantástico',
  senha: 'e-business',
  perfil: Perfil['ORIENTADOR'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
