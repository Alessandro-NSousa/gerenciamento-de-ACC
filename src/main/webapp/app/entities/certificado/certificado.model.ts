import dayjs from 'dayjs/esm';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { ITurmaACC } from 'app/entities/turma-acc/turma-acc.model';
import { ITipoAtividade } from 'app/entities/tipo-atividade/tipo-atividade.model';
import { Modalidade } from 'app/entities/enumerations/modalidade.model';
import { StatusCertificado } from 'app/entities/enumerations/status-certificado.model';

export interface ICertificado {
  id: number;
  titulo?: string | null;
  descricao?: string | null;
  dataDeEnvio?: dayjs.Dayjs | null;
  observacao?: string | null;
  modalidade?: Modalidade | null;
  chCuprida?: number | null;
  pontuacao?: number | null;
  status?: StatusCertificado | null;
  caminhoDoArquivo?: string | null;
  usuario?: Pick<IUsuario, 'id' | 'nome'> | null;
  turmaAcc?: Pick<ITurmaACC, 'id' | 'nome'> | null;
  tipoAtividade?: Pick<ITipoAtividade, 'id' | 'nome'> | null;
}

export type NewCertificado = Omit<ICertificado, 'id'> & { id: null };
