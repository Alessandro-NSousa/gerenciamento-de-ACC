import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../turma-acc.test-samples';

import { TurmaACCFormService } from './turma-acc-form.service';

describe('TurmaACC Form Service', () => {
  let service: TurmaACCFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurmaACCFormService);
  });

  describe('Service methods', () => {
    describe('createTurmaACCFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTurmaACCFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            inicio: expect.any(Object),
            termino: expect.any(Object),
            usuarios: expect.any(Object),
            cursos: expect.any(Object),
          })
        );
      });

      it('passing ITurmaACC should create a new form with FormGroup', () => {
        const formGroup = service.createTurmaACCFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            inicio: expect.any(Object),
            termino: expect.any(Object),
            usuarios: expect.any(Object),
            cursos: expect.any(Object),
          })
        );
      });
    });

    describe('getTurmaACC', () => {
      it('should return NewTurmaACC for default TurmaACC initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTurmaACCFormGroup(sampleWithNewData);

        const turmaACC = service.getTurmaACC(formGroup) as any;

        expect(turmaACC).toMatchObject(sampleWithNewData);
      });

      it('should return NewTurmaACC for empty TurmaACC initial value', () => {
        const formGroup = service.createTurmaACCFormGroup();

        const turmaACC = service.getTurmaACC(formGroup) as any;

        expect(turmaACC).toMatchObject({});
      });

      it('should return ITurmaACC', () => {
        const formGroup = service.createTurmaACCFormGroup(sampleWithRequiredData);

        const turmaACC = service.getTurmaACC(formGroup) as any;

        expect(turmaACC).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITurmaACC should not enable id FormControl', () => {
        const formGroup = service.createTurmaACCFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTurmaACC should disable id FormControl', () => {
        const formGroup = service.createTurmaACCFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
