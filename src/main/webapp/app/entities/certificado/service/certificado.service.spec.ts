import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICertificado } from '../certificado.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../certificado.test-samples';

import { CertificadoService, RestCertificado } from './certificado.service';

const requireRestSample: RestCertificado = {
  ...sampleWithRequiredData,
  dataDeEnvio: sampleWithRequiredData.dataDeEnvio?.toJSON(),
};

describe('Certificado Service', () => {
  let service: CertificadoService;
  let httpMock: HttpTestingController;
  let expectedResult: ICertificado | ICertificado[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CertificadoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Certificado', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const certificado = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(certificado).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Certificado', () => {
      const certificado = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(certificado).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Certificado', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Certificado', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Certificado', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCertificadoToCollectionIfMissing', () => {
      it('should add a Certificado to an empty array', () => {
        const certificado: ICertificado = sampleWithRequiredData;
        expectedResult = service.addCertificadoToCollectionIfMissing([], certificado);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(certificado);
      });

      it('should not add a Certificado to an array that contains it', () => {
        const certificado: ICertificado = sampleWithRequiredData;
        const certificadoCollection: ICertificado[] = [
          {
            ...certificado,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCertificadoToCollectionIfMissing(certificadoCollection, certificado);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Certificado to an array that doesn't contain it", () => {
        const certificado: ICertificado = sampleWithRequiredData;
        const certificadoCollection: ICertificado[] = [sampleWithPartialData];
        expectedResult = service.addCertificadoToCollectionIfMissing(certificadoCollection, certificado);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(certificado);
      });

      it('should add only unique Certificado to an array', () => {
        const certificadoArray: ICertificado[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const certificadoCollection: ICertificado[] = [sampleWithRequiredData];
        expectedResult = service.addCertificadoToCollectionIfMissing(certificadoCollection, ...certificadoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const certificado: ICertificado = sampleWithRequiredData;
        const certificado2: ICertificado = sampleWithPartialData;
        expectedResult = service.addCertificadoToCollectionIfMissing([], certificado, certificado2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(certificado);
        expect(expectedResult).toContain(certificado2);
      });

      it('should accept null and undefined values', () => {
        const certificado: ICertificado = sampleWithRequiredData;
        expectedResult = service.addCertificadoToCollectionIfMissing([], null, certificado, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(certificado);
      });

      it('should return initial array if no Certificado is added', () => {
        const certificadoCollection: ICertificado[] = [sampleWithRequiredData];
        expectedResult = service.addCertificadoToCollectionIfMissing(certificadoCollection, undefined, null);
        expect(expectedResult).toEqual(certificadoCollection);
      });
    });

    describe('compareCertificado', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCertificado(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCertificado(entity1, entity2);
        const compareResult2 = service.compareCertificado(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCertificado(entity1, entity2);
        const compareResult2 = service.compareCertificado(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCertificado(entity1, entity2);
        const compareResult2 = service.compareCertificado(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
