import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITurmaACC, NewTurmaACC } from '../turma-acc.model';

export type PartialUpdateTurmaACC = Partial<ITurmaACC> & Pick<ITurmaACC, 'id'>;

type RestOf<T extends ITurmaACC | NewTurmaACC> = Omit<T, 'inicio' | 'termino'> & {
  inicio?: string | null;
  termino?: string | null;
};

export type RestTurmaACC = RestOf<ITurmaACC>;

export type NewRestTurmaACC = RestOf<NewTurmaACC>;

export type PartialUpdateRestTurmaACC = RestOf<PartialUpdateTurmaACC>;

export type EntityResponseType = HttpResponse<ITurmaACC>;
export type EntityArrayResponseType = HttpResponse<ITurmaACC[]>;

@Injectable({ providedIn: 'root' })
export class TurmaACCService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/turma-accs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(turmaACC: NewTurmaACC): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(turmaACC);
    return this.http
      .post<RestTurmaACC>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(turmaACC: ITurmaACC): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(turmaACC);
    return this.http
      .put<RestTurmaACC>(`${this.resourceUrl}/${this.getTurmaACCIdentifier(turmaACC)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(turmaACC: PartialUpdateTurmaACC): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(turmaACC);
    return this.http
      .patch<RestTurmaACC>(`${this.resourceUrl}/${this.getTurmaACCIdentifier(turmaACC)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTurmaACC>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTurmaACC[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTurmaACCIdentifier(turmaACC: Pick<ITurmaACC, 'id'>): number {
    return turmaACC.id;
  }

  compareTurmaACC(o1: Pick<ITurmaACC, 'id'> | null, o2: Pick<ITurmaACC, 'id'> | null): boolean {
    return o1 && o2 ? this.getTurmaACCIdentifier(o1) === this.getTurmaACCIdentifier(o2) : o1 === o2;
  }

  addTurmaACCToCollectionIfMissing<Type extends Pick<ITurmaACC, 'id'>>(
    turmaACCCollection: Type[],
    ...turmaACCSToCheck: (Type | null | undefined)[]
  ): Type[] {
    const turmaACCS: Type[] = turmaACCSToCheck.filter(isPresent);
    if (turmaACCS.length > 0) {
      const turmaACCCollectionIdentifiers = turmaACCCollection.map(turmaACCItem => this.getTurmaACCIdentifier(turmaACCItem)!);
      const turmaACCSToAdd = turmaACCS.filter(turmaACCItem => {
        const turmaACCIdentifier = this.getTurmaACCIdentifier(turmaACCItem);
        if (turmaACCCollectionIdentifiers.includes(turmaACCIdentifier)) {
          return false;
        }
        turmaACCCollectionIdentifiers.push(turmaACCIdentifier);
        return true;
      });
      return [...turmaACCSToAdd, ...turmaACCCollection];
    }
    return turmaACCCollection;
  }

  protected convertDateFromClient<T extends ITurmaACC | NewTurmaACC | PartialUpdateTurmaACC>(turmaACC: T): RestOf<T> {
    return {
      ...turmaACC,
      inicio: turmaACC.inicio?.format(DATE_FORMAT) ?? null,
      termino: turmaACC.termino?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restTurmaACC: RestTurmaACC): ITurmaACC {
    return {
      ...restTurmaACC,
      inicio: restTurmaACC.inicio ? dayjs(restTurmaACC.inicio) : undefined,
      termino: restTurmaACC.termino ? dayjs(restTurmaACC.termino) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTurmaACC>): HttpResponse<ITurmaACC> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTurmaACC[]>): HttpResponse<ITurmaACC[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
