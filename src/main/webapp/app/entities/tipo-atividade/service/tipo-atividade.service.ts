import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITipoAtividade, NewTipoAtividade } from '../tipo-atividade.model';

export type PartialUpdateTipoAtividade = Partial<ITipoAtividade> & Pick<ITipoAtividade, 'id'>;

type RestOf<T extends ITipoAtividade | NewTipoAtividade> = Omit<T, 'dataCriacao'> & {
  dataCriacao?: string | null;
};

export type RestTipoAtividade = RestOf<ITipoAtividade>;

export type NewRestTipoAtividade = RestOf<NewTipoAtividade>;

export type PartialUpdateRestTipoAtividade = RestOf<PartialUpdateTipoAtividade>;

export type EntityResponseType = HttpResponse<ITipoAtividade>;
export type EntityArrayResponseType = HttpResponse<ITipoAtividade[]>;

@Injectable({ providedIn: 'root' })
export class TipoAtividadeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tipo-atividades');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tipoAtividade: NewTipoAtividade): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tipoAtividade);
    return this.http
      .post<RestTipoAtividade>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(tipoAtividade: ITipoAtividade): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tipoAtividade);
    return this.http
      .put<RestTipoAtividade>(`${this.resourceUrl}/${this.getTipoAtividadeIdentifier(tipoAtividade)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(tipoAtividade: PartialUpdateTipoAtividade): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tipoAtividade);
    return this.http
      .patch<RestTipoAtividade>(`${this.resourceUrl}/${this.getTipoAtividadeIdentifier(tipoAtividade)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTipoAtividade>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTipoAtividade[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTipoAtividadeIdentifier(tipoAtividade: Pick<ITipoAtividade, 'id'>): number {
    return tipoAtividade.id;
  }

  compareTipoAtividade(o1: Pick<ITipoAtividade, 'id'> | null, o2: Pick<ITipoAtividade, 'id'> | null): boolean {
    return o1 && o2 ? this.getTipoAtividadeIdentifier(o1) === this.getTipoAtividadeIdentifier(o2) : o1 === o2;
  }

  addTipoAtividadeToCollectionIfMissing<Type extends Pick<ITipoAtividade, 'id'>>(
    tipoAtividadeCollection: Type[],
    ...tipoAtividadesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tipoAtividades: Type[] = tipoAtividadesToCheck.filter(isPresent);
    if (tipoAtividades.length > 0) {
      const tipoAtividadeCollectionIdentifiers = tipoAtividadeCollection.map(
        tipoAtividadeItem => this.getTipoAtividadeIdentifier(tipoAtividadeItem)!
      );
      const tipoAtividadesToAdd = tipoAtividades.filter(tipoAtividadeItem => {
        const tipoAtividadeIdentifier = this.getTipoAtividadeIdentifier(tipoAtividadeItem);
        if (tipoAtividadeCollectionIdentifiers.includes(tipoAtividadeIdentifier)) {
          return false;
        }
        tipoAtividadeCollectionIdentifiers.push(tipoAtividadeIdentifier);
        return true;
      });
      return [...tipoAtividadesToAdd, ...tipoAtividadeCollection];
    }
    return tipoAtividadeCollection;
  }

  protected convertDateFromClient<T extends ITipoAtividade | NewTipoAtividade | PartialUpdateTipoAtividade>(tipoAtividade: T): RestOf<T> {
    return {
      ...tipoAtividade,
      dataCriacao: tipoAtividade.dataCriacao?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTipoAtividade: RestTipoAtividade): ITipoAtividade {
    return {
      ...restTipoAtividade,
      dataCriacao: restTipoAtividade.dataCriacao ? dayjs(restTipoAtividade.dataCriacao) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTipoAtividade>): HttpResponse<ITipoAtividade> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTipoAtividade[]>): HttpResponse<ITipoAtividade[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
