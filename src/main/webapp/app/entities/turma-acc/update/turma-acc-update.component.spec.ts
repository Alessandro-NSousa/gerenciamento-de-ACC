import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TurmaACCFormService } from './turma-acc-form.service';
import { TurmaACCService } from '../service/turma-acc.service';
import { ITurmaACC } from '../turma-acc.model';

import { TurmaACCUpdateComponent } from './turma-acc-update.component';

describe('TurmaACC Management Update Component', () => {
  let comp: TurmaACCUpdateComponent;
  let fixture: ComponentFixture<TurmaACCUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let turmaACCFormService: TurmaACCFormService;
  let turmaACCService: TurmaACCService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TurmaACCUpdateComponent],
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
      .overrideTemplate(TurmaACCUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TurmaACCUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    turmaACCFormService = TestBed.inject(TurmaACCFormService);
    turmaACCService = TestBed.inject(TurmaACCService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const turmaACC: ITurmaACC = { id: 456 };

      activatedRoute.data = of({ turmaACC });
      comp.ngOnInit();

      expect(comp.turmaACC).toEqual(turmaACC);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITurmaACC>>();
      const turmaACC = { id: 123 };
      jest.spyOn(turmaACCFormService, 'getTurmaACC').mockReturnValue(turmaACC);
      jest.spyOn(turmaACCService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ turmaACC });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: turmaACC }));
      saveSubject.complete();

      // THEN
      expect(turmaACCFormService.getTurmaACC).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(turmaACCService.update).toHaveBeenCalledWith(expect.objectContaining(turmaACC));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITurmaACC>>();
      const turmaACC = { id: 123 };
      jest.spyOn(turmaACCFormService, 'getTurmaACC').mockReturnValue({ id: null });
      jest.spyOn(turmaACCService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ turmaACC: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: turmaACC }));
      saveSubject.complete();

      // THEN
      expect(turmaACCFormService.getTurmaACC).toHaveBeenCalled();
      expect(turmaACCService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITurmaACC>>();
      const turmaACC = { id: 123 };
      jest.spyOn(turmaACCService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ turmaACC });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(turmaACCService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
