import dayjs from 'dayjs/esm';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { ICurso } from 'app/entities/curso/curso.model';

export interface ITurmaACC {
  id: number;
  nome?: string | null;
  inicio?: dayjs.Dayjs | null;
  termino?: dayjs.Dayjs | null;
  usuarios?: Pick<IUsuario, 'id' | 'nome'>[] | null;
  cursos?: Pick<ICurso, 'id' | 'nomeCurso'>[] | null;
}

export type NewTurmaACC = Omit<ITurmaACC, 'id'> & { id: null };
