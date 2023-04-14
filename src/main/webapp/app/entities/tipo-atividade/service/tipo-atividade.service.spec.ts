import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITipoAtividade } from '../tipo-atividade.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tipo-atividade.test-samples';

import { TipoAtividadeService, RestTipoAtividade } from './tipo-atividade.service';

const requireRestSample: RestTipoAtividade = {
  ...sampleWithRequiredData,
  dataCriacao: sampleWithRequiredData.dataCriacao?.toJSON(),
};

describe('TipoAtividade Service', () => {
  let service: TipoAtividadeService;
  let httpMock: HttpTestingController;
  let expectedResult: ITipoAtividade | ITipoAtividade[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TipoAtividadeService);
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

    it('should create a TipoAtividade', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tipoAtividade = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tipoAtividade).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TipoAtividade', () => {
      const tipoAtividade = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tipoAtividade).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TipoAtividade', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TipoAtividade', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TipoAtividade', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTipoAtividadeToCollectionIfMissing', () => {
      it('should add a TipoAtividade to an empty array', () => {
        const tipoAtividade: ITipoAtividade = sampleWithRequiredData;
        expectedResult = service.addTipoAtividadeToCollectionIfMissing([], tipoAtividade);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoAtividade);
      });

      it('should not add a TipoAtividade to an array that contains it', () => {
        const tipoAtividade: ITipoAtividade = sampleWithRequiredData;
        const tipoAtividadeCollection: ITipoAtividade[] = [
          {
            ...tipoAtividade,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTipoAtividadeToCollectionIfMissing(tipoAtividadeCollection, tipoAtividade);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TipoAtividade to an array that doesn't contain it", () => {
        const tipoAtividade: ITipoAtividade = sampleWithRequiredData;
        const tipoAtividadeCollection: ITipoAtividade[] = [sampleWithPartialData];
        expectedResult = service.addTipoAtividadeToCollectionIfMissing(tipoAtividadeCollection, tipoAtividade);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoAtividade);
      });

      it('should add only unique TipoAtividade to an array', () => {
        const tipoAtividadeArray: ITipoAtividade[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const tipoAtividadeCollection: ITipoAtividade[] = [sampleWithRequiredData];
        expectedResult = service.addTipoAtividadeToCollectionIfMissing(tipoAtividadeCollection, ...tipoAtividadeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tipoAtividade: ITipoAtividade = sampleWithRequiredData;
        const tipoAtividade2: ITipoAtividade = sampleWithPartialData;
        expectedResult = service.addTipoAtividadeToCollectionIfMissing([], tipoAtividade, tipoAtividade2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoAtividade);
        expect(expectedResult).toContain(tipoAtividade2);
      });

      it('should accept null and undefined values', () => {
        const tipoAtividade: ITipoAtividade = sampleWithRequiredData;
        expectedResult = service.addTipoAtividadeToCollectionIfMissing([], null, tipoAtividade, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoAtividade);
      });

      it('should return initial array if no TipoAtividade is added', () => {
        const tipoAtividadeCollection: ITipoAtividade[] = [sampleWithRequiredData];
        expectedResult = service.addTipoAtividadeToCollectionIfMissing(tipoAtividadeCollection, undefined, null);
        expect(expectedResult).toEqual(tipoAtividadeCollection);
      });
    });

    describe('compareTipoAtividade', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTipoAtividade(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTipoAtividade(entity1, entity2);
        const compareResult2 = service.compareTipoAtividade(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTipoAtividade(entity1, entity2);
        const compareResult2 = service.compareTipoAtividade(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTipoAtividade(entity1, entity2);
        const compareResult2 = service.compareTipoAtividade(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
