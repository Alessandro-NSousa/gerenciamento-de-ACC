import { ICurso, NewCurso } from './curso.model';

export const sampleWithRequiredData: ICurso = {
  id: 11617,
  nomeCurso: 'Metal FTP extend',
};

export const sampleWithPartialData: ICurso = {
  id: 26165,
  nomeCurso: 'Home',
};

export const sampleWithFullData: ICurso = {
  id: 26511,
  nomeCurso: 'Dollar',
  sigla: 'Macio human-resource Atum',
};

export const sampleWithNewData: NewCurso = {
  nomeCurso: 'implement compress',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
