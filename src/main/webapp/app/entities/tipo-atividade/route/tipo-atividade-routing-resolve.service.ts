import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITipoAtividade } from '../tipo-atividade.model';
import { TipoAtividadeService } from '../service/tipo-atividade.service';

@Injectable({ providedIn: 'root' })
export class TipoAtividadeRoutingResolveService implements Resolve<ITipoAtividade | null> {
  constructor(protected service: TipoAtividadeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITipoAtividade | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tipoAtividade: HttpResponse<ITipoAtividade>) => {
          if (tipoAtividade.body) {
            return of(tipoAtividade.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
