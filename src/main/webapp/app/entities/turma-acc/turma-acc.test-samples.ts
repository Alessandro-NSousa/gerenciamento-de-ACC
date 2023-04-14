import dayjs from 'dayjs/esm';

import { ITurmaACC, NewTurmaACC } from './turma-acc.model';

export const sampleWithRequiredData: ITurmaACC = {
  id: 65069,
  nome: 'facilitate proactive',
};

export const sampleWithPartialData: ITurmaACC = {
  id: 99042,
  nome: 'connecting',
  inicio: dayjs('2023-04-13'),
};

export const sampleWithFullData: ITurmaACC = {
  id: 94782,
  nome: 'EXE deposit Travessa',
  inicio: dayjs('2023-04-13'),
  termino: dayjs('2023-04-13'),
};

export const sampleWithNewData: NewTurmaACC = {
  nome: 'do de e-markets',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
