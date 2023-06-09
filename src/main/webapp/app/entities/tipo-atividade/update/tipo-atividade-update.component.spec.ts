import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TipoAtividadeFormService } from './tipo-atividade-form.service';
import { TipoAtividadeService } from '../service/tipo-atividade.service';
import { ITipoAtividade } from '../tipo-atividade.model';

import { TipoAtividadeUpdateComponent } from './tipo-atividade-update.component';

describe('TipoAtividade Management Update Component', () => {
  let comp: TipoAtividadeUpdateComponent;
  let fixture: ComponentFixture<TipoAtividadeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tipoAtividadeFormService: TipoAtividadeFormService;
  let tipoAtividadeService: TipoAtividadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TipoAtividadeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TipoAtividadeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TipoAtividadeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tipoAtividadeFormService = TestBed.inject(TipoAtividadeFormService);
    tipoAtividadeService = TestBed.inject(TipoAtividadeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const tipoAtividade: ITipoAtividade = { id: 456 };

      activatedRoute.data = of({ tipoAtividade });
      comp.ngOnInit();

      expect(comp.tipoAtividade).toEqual(tipoAtividade);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoAtividade>>();
      const tipoAtividade = { id: 123 };
      jest.spyOn(tipoAtividadeFormService, 'getTipoAtividade').mockReturnValue(tipoAtividade);
      jest.spyOn(tipoAtividadeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoAtividade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoAtividade }));
      saveSubject.complete();

      // THEN
      expect(tipoAtividadeFormService.getTipoAtividade).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tipoAtividadeService.update).toHaveBeenCalledWith(expect.objectContaining(tipoAtividade));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoAtividade>>();
      const tipoAtividade = { id: 123 };
      jest.spyOn(tipoAtividadeFormService, 'getTipoAtividade').mockReturnValue({ id: null });
      jest.spyOn(tipoAtividadeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoAtividade: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoAtividade }));
      saveSubject.complete();

      // THEN
      expect(tipoAtividadeFormService.getTipoAtividade).toHaveBeenCalled();
      expect(tipoAtividadeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoAtividade>>();
      const tipoAtividade = { id: 123 };
      jest.spyOn(tipoAtividadeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoAtividade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tipoAtividadeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
