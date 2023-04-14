import { ITurmaACC } from 'app/entities/turma-acc/turma-acc.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface ICurso {
  id: number;
  nomeCurso?: string | null;
  sigla?: string | null;
  turmas?: Pick<ITurmaACC, 'id' | 'nome'>[] | null;
  usuarios?: Pick<IUsuario, 'id' | 'nome'>[] | null;
}

export type NewCurso = Omit<ICurso, 'id'> & { id: null };
