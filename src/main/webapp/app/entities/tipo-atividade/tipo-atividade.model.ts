import dayjs from 'dayjs/esm';

export interface ITipoAtividade {
  id: number;
  nome?: string | null;
  descricao?: string | null;
  numeroDePontos?: number | null;
  dataCriacao?: dayjs.Dayjs | null;
}

export type NewTipoAtividade = Omit<ITipoAtividade, 'id'> & { id: null };
