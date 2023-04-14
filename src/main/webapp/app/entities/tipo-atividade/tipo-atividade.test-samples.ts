import dayjs from 'dayjs/esm';

import { ITipoAtividade, NewTipoAtividade } from './tipo-atividade.model';

export const sampleWithRequiredData: ITipoAtividade = {
  id: 42833,
  nome: 'Ferramentas hacking',
};

export const sampleWithPartialData: ITipoAtividade = {
  id: 90350,
  nome: 'Rústico override Sergipe',
};

export const sampleWithFullData: ITipoAtividade = {
  id: 20918,
  nome: 'Lead Function-based Market',
  descricao: '../fake-data/blob/hipster.txt',
  numeroDePontos: 27445,
  dataCriacao: dayjs('2023-04-13T14:00'),
};

export const sampleWithNewData: NewTipoAtividade = {
  nome: 'XML Prático',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
