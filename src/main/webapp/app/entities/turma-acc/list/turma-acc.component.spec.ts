import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TurmaACCService } from '../service/turma-acc.service';

import { TurmaACCComponent } from './turma-acc.component';

describe('TurmaACC Management Component', () => {
  let comp: TurmaACCComponent;
  let fixture: ComponentFixture<TurmaACCComponent>;
  let service: TurmaACCService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'turma-acc', component: TurmaACCComponent }]), HttpClientTestingModule],
      declarations: [TurmaACCComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(TurmaACCComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TurmaACCComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TurmaACCService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.turmaACCS?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to turmaACCService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTurmaACCIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTurmaACCIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
