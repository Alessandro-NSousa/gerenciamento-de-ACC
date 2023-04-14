import dayjs from 'dayjs/esm';

import { Modalidade } from 'app/entities/enumerations/modalidade.model';
import { StatusCertificado } from 'app/entities/enumerations/status-certificado.model';

import { ICertificado, NewCertificado } from './certificado.model';

export const sampleWithRequiredData: ICertificado = {
  id: 85619,
};

export const sampleWithPartialData: ICertificado = {
  id: 73534,
  descricao: '../fake-data/blob/hipster.txt',
  modalidade: Modalidade['REGIONAL'],
  pontuacao: 18014,
  caminhoDoArquivo: 'Human',
};

export const sampleWithFullData: ICertificado = {
  id: 87374,
  titulo: 'Casa content Group',
  descricao: '../fake-data/blob/hipster.txt',
  dataDeEnvio: dayjs('2023-04-13T18:01'),
  observacao: '../fake-data/blob/hipster.txt',
  modalidade: Modalidade['ONLINE'],
  chCuprida: 9576,
  pontuacao: 86795,
  status: StatusCertificado['REPROVADO'],
  caminhoDoArquivo: 'invoice Refinado Fresco',
};

export const sampleWithNewData: NewCertificado = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
