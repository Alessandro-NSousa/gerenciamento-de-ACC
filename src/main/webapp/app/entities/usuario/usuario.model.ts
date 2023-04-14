import dayjs from 'dayjs/esm';
import { ITurmaACC } from 'app/entities/turma-acc/turma-acc.model';
import { ICurso } from 'app/entities/curso/curso.model';
import { Perfil } from 'app/entities/enumerations/perfil.model';

export interface IUsuario {
  id: number;
  nome?: string | null;
  login?: string | null;
  senha?: string | null;
  dataCadastro?: dayjs.Dayjs | null;
  ultimoAcesso?: dayjs.Dayjs | null;
  perfil?: Perfil | null;
  turmas?: Pick<ITurmaACC, 'id' | 'nome'>[] | null;
  cursos?: Pick<ICurso, 'id' | 'nomeCurso'>[] | null;
}

export type NewUsuario = Omit<IUsuario, 'id'> & { id: null };
