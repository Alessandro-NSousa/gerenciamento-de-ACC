import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../certificado.test-samples';

import { CertificadoFormService } from './certificado-form.service';

describe('Certificado Form Service', () => {
  let service: CertificadoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificadoFormService);
  });

  describe('Service methods', () => {
    describe('createCertificadoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCertificadoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titulo: expect.any(Object),
            descricao: expect.any(Object),
            dataDeEnvio: expect.any(Object),
            observacao: expect.any(Object),
            modalidade: expect.any(Object),
            chCuprida: expect.any(Object),
            pontuacao: expect.any(Object),
            status: expect.any(Object),
            caminhoDoArquivo: expect.any(Object),
            usuario: expect.any(Object),
            turmaAcc: expect.any(Object),
            tipoAtividade: expect.any(Object),
          })
        );
      });

      it('passing ICertificado should create a new form with FormGroup', () => {
        const formGroup = service.createCertificadoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titulo: expect.any(Object),
            descricao: expect.any(Object),
            dataDeEnvio: expect.any(Object),
            observacao: expect.any(Object),
            modalidade: expect.any(Object),
            chCuprida: expect.any(Object),
            pontuacao: expect.any(Object),
            status: expect.any(Object),
            caminhoDoArquivo: expect.any(Object),
            usuario: expect.any(Object),
            turmaAcc: expect.any(Object),
            tipoAtividade: expect.any(Object),
          })
        );
      });
    });

    describe('getCertificado', () => {
      it('should return NewCertificado for default Certificado initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCertificadoFormGroup(sampleWithNewData);

        const certificado = service.getCertificado(formGroup) as any;

        expect(certificado).toMatchObject(sampleWithNewData);
      });

      it('should return NewCertificado for empty Certificado initial value', () => {
        const formGroup = service.createCertificadoFormGroup();

        const certificado = service.getCertificado(formGroup) as any;

        expect(certificado).toMatchObject({});
      });

      it('should return ICertificado', () => {
        const formGroup = service.createCertificadoFormGroup(sampleWithRequiredData);

        const certificado = service.getCertificado(formGroup) as any;

        expect(certificado).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICertificado should not enable id FormControl', () => {
        const formGroup = service.createCertificadoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCertificado should disable id FormControl', () => {
        const formGroup = service.createCertificadoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
