import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CertificadoFormService } from './certificado-form.service';
import { CertificadoService } from '../service/certificado.service';
import { ICertificado } from '../certificado.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { ITurmaACC } from 'app/entities/turma-acc/turma-acc.model';
import { TurmaACCService } from 'app/entities/turma-acc/service/turma-acc.service';
import { ITipoAtividade } from 'app/entities/tipo-atividade/tipo-atividade.model';
import { TipoAtividadeService } from 'app/entities/tipo-atividade/service/tipo-atividade.service';

import { CertificadoUpdateComponent } from './certificado-update.component';

describe('Certificado Management Update Component', () => {
  let comp: CertificadoUpdateComponent;
  let fixture: ComponentFixture<CertificadoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let certificadoFormService: CertificadoFormService;
  let certificadoService: CertificadoService;
  let usuarioService: UsuarioService;
  let turmaACCService: TurmaACCService;
  let tipoAtividadeService: TipoAtividadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CertificadoUpdateComponent],
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
      .overrideTemplate(CertificadoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CertificadoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    certificadoFormService = TestBed.inject(CertificadoFormService);
    certificadoService = TestBed.inject(CertificadoService);
    usuarioService = TestBed.inject(UsuarioService);
    turmaACCService = TestBed.inject(TurmaACCService);
    tipoAtividadeService = TestBed.inject(TipoAtividadeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Usuario query and add missing value', () => {
      const certificado: ICertificado = { id: 456 };
      const usuario: IUsuario = { id: 45915 };
      certificado.usuario = usuario;

      const usuarioCollection: IUsuario[] = [{ id: 81532 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [usuario];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ certificado });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(
        usuarioCollection,
        ...additionalUsuarios.map(expect.objectContaining)
      );
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TurmaACC query and add missing value', () => {
      const certificado: ICertificado = { id: 456 };
      const turmaAcc: ITurmaACC = { id: 54012 };
      certificado.turmaAcc = turmaAcc;

      const turmaACCCollection: ITurmaACC[] = [{ id: 57904 }];
      jest.spyOn(turmaACCService, 'query').mockReturnValue(of(new HttpResponse({ body: turmaACCCollection })));
      const additionalTurmaACCS = [turmaAcc];
      const expectedCollection: ITurmaACC[] = [...additionalTurmaACCS, ...turmaACCCollection];
      jest.spyOn(turmaACCService, 'addTurmaACCToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ certificado });
      comp.ngOnInit();

      expect(turmaACCService.query).toHaveBeenCalled();
      expect(turmaACCService.addTurmaACCToCollectionIfMissing).toHaveBeenCalledWith(
        turmaACCCollection,
        ...additionalTurmaACCS.map(expect.objectContaining)
      );
      expect(comp.turmaACCSSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TipoAtividade query and add missing value', () => {
      const certificado: ICertificado = { id: 456 };
      const tipoAtividade: ITipoAtividade = { id: 31216 };
      certificado.tipoAtividade = tipoAtividade;

      const tipoAtividadeCollection: ITipoAtividade[] = [{ id: 68981 }];
      jest.spyOn(tipoAtividadeService, 'query').mockReturnValue(of(new HttpResponse({ body: tipoAtividadeCollection })));
      const additionalTipoAtividades = [tipoAtividade];
      const expectedCollection: ITipoAtividade[] = [...additionalTipoAtividades, ...tipoAtividadeCollection];
      jest.spyOn(tipoAtividadeService, 'addTipoAtividadeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ certificado });
      comp.ngOnInit();

      expect(tipoAtividadeService.query).toHaveBeenCalled();
      expect(tipoAtividadeService.addTipoAtividadeToCollectionIfMissing).toHaveBeenCalledWith(
        tipoAtividadeCollection,
        ...additionalTipoAtividades.map(expect.objectContaining)
      );
      expect(comp.tipoAtividadesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const certificado: ICertificado = { id: 456 };
      const usuario: IUsuario = { id: 71816 };
      certificado.usuario = usuario;
      const turmaAcc: ITurmaACC = { id: 54476 };
      certificado.turmaAcc = turmaAcc;
      const tipoAtividade: ITipoAtividade = { id: 38376 };
      certificado.tipoAtividade = tipoAtividade;

      activatedRoute.data = of({ certificado });
      comp.ngOnInit();

      expect(comp.usuariosSharedCollection).toContain(usuario);
      expect(comp.turmaACCSSharedCollection).toContain(turmaAcc);
      expect(comp.tipoAtividadesSharedCollection).toContain(tipoAtividade);
      expect(comp.certificado).toEqual(certificado);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICertificado>>();
      const certificado = { id: 123 };
      jest.spyOn(certificadoFormService, 'getCertificado').mockReturnValue(certificado);
      jest.spyOn(certificadoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ certificado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: certificado }));
      saveSubject.complete();

      // THEN
      expect(certificadoFormService.getCertificado).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(certificadoService.update).toHaveBeenCalledWith(expect.objectContaining(certificado));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICertificado>>();
      const certificado = { id: 123 };
      jest.spyOn(certificadoFormService, 'getCertificado').mockReturnValue({ id: null });
      jest.spyOn(certificadoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ certificado: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: certificado }));
      saveSubject.complete();

      // THEN
      expect(certificadoFormService.getCertificado).toHaveBeenCalled();
      expect(certificadoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICertificado>>();
      const certificado = { id: 123 };
      jest.spyOn(certificadoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ certificado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(certificadoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUsuario', () => {
      it('Should forward to usuarioService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(usuarioService, 'compareUsuario');
        comp.compareUsuario(entity, entity2);
        expect(usuarioService.compareUsuario).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTurmaACC', () => {
      it('Should forward to turmaACCService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(turmaACCService, 'compareTurmaACC');
        comp.compareTurmaACC(entity, entity2);
        expect(turmaACCService.compareTurmaACC).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTipoAtividade', () => {
      it('Should forward to tipoAtividadeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(tipoAtividadeService, 'compareTipoAtividade');
        comp.compareTipoAtividade(entity, entity2);
        expect(tipoAtividadeService.compareTipoAtividade).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
