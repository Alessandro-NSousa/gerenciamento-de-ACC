import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICertificado, NewCertificado } from '../certificado.model';

export type PartialUpdateCertificado = Partial<ICertificado> & Pick<ICertificado, 'id'>;

type RestOf<T extends ICertificado | NewCertificado> = Omit<T, 'dataDeEnvio'> & {
  dataDeEnvio?: string | null;
};

export type RestCertificado = RestOf<ICertificado>;

export type NewRestCertificado = RestOf<NewCertificado>;

export type PartialUpdateRestCertificado = RestOf<PartialUpdateCertificado>;

export type EntityResponseType = HttpResponse<ICertificado>;
export type EntityArrayResponseType = HttpResponse<ICertificado[]>;

@Injectable({ providedIn: 'root' })
export class CertificadoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/certificados');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(certificado: NewCertificado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificado);
    return this.http
      .post<RestCertificado>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(certificado: ICertificado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificado);
    return this.http
      .put<RestCertificado>(`${this.resourceUrl}/${this.getCertificadoIdentifier(certificado)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(certificado: PartialUpdateCertificado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(certificado);
    return this.http
      .patch<RestCertificado>(`${this.resourceUrl}/${this.getCertificadoIdentifier(certificado)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCertificado>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCertificado[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCertificadoIdentifier(certificado: Pick<ICertificado, 'id'>): number {
    return certificado.id;
  }

  compareCertificado(o1: Pick<ICertificado, 'id'> | null, o2: Pick<ICertificado, 'id'> | null): boolean {
    return o1 && o2 ? this.getCertificadoIdentifier(o1) === this.getCertificadoIdentifier(o2) : o1 === o2;
  }

  addCertificadoToCollectionIfMissing<Type extends Pick<ICertificado, 'id'>>(
    certificadoCollection: Type[],
    ...certificadosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const certificados: Type[] = certificadosToCheck.filter(isPresent);
    if (certificados.length > 0) {
      const certificadoCollectionIdentifiers = certificadoCollection.map(
        certificadoItem => this.getCertificadoIdentifier(certificadoItem)!
      );
      const certificadosToAdd = certificados.filter(certificadoItem => {
        const certificadoIdentifier = this.getCertificadoIdentifier(certificadoItem);
        if (certificadoCollectionIdentifiers.includes(certificadoIdentifier)) {
          return false;
        }
        certificadoCollectionIdentifiers.push(certificadoIdentifier);
        return true;
      });
      return [...certificadosToAdd, ...certificadoCollection];
    }
    return certificadoCollection;
  }

  protected convertDateFromClient<T extends ICertificado | NewCertificado | PartialUpdateCertificado>(certificado: T): RestOf<T> {
    return {
      ...certificado,
      dataDeEnvio: certificado.dataDeEnvio?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCertificado: RestCertificado): ICertificado {
    return {
      ...restCertificado,
      dataDeEnvio: restCertificado.dataDeEnvio ? dayjs(restCertificado.dataDeEnvio) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCertificado>): HttpResponse<ICertificado> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCertificado[]>): HttpResponse<ICertificado[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
