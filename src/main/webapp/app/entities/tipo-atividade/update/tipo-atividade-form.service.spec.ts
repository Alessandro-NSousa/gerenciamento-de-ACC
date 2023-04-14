import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tipo-atividade.test-samples';

import { TipoAtividadeFormService } from './tipo-atividade-form.service';

describe('TipoAtividade Form Service', () => {
  let service: TipoAtividadeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoAtividadeFormService);
  });

  describe('Service methods', () => {
    describe('createTipoAtividadeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTipoAtividadeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            descricao: expect.any(Object),
            numeroDePontos: expect.any(Object),
            dataCriacao: expect.any(Object),
          })
        );
      });

      it('passing ITipoAtividade should create a new form with FormGroup', () => {
        const formGroup = service.createTipoAtividadeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            descricao: expect.any(Object),
            numeroDePontos: expect.any(Object),
            dataCriacao: expect.any(Object),
          })
        );
      });
    });

    describe('getTipoAtividade', () => {
      it('should return NewTipoAtividade for default TipoAtividade initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTipoAtividadeFormGroup(sampleWithNewData);

        const tipoAtividade = service.getTipoAtividade(formGroup) as any;

        expect(tipoAtividade).toMatchObject(sampleWithNewData);
      });

      it('should return NewTipoAtividade for empty TipoAtividade initial value', () => {
        const formGroup = service.createTipoAtividadeFormGroup();

        const tipoAtividade = service.getTipoAtividade(formGroup) as any;

        expect(tipoAtividade).toMatchObject({});
      });

      it('should return ITipoAtividade', () => {
        const formGroup = service.createTipoAtividadeFormGroup(sampleWithRequiredData);

        const tipoAtividade = service.getTipoAtividade(formGroup) as any;

        expect(tipoAtividade).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITipoAtividade should not enable id FormControl', () => {
        const formGroup = service.createTipoAtividadeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTipoAtividade should disable id FormControl', () => {
        const formGroup = service.createTipoAtividadeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
