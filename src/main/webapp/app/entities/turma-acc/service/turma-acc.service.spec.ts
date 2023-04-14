import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITurmaACC } from '../turma-acc.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../turma-acc.test-samples';

import { TurmaACCService, RestTurmaACC } from './turma-acc.service';

const requireRestSample: RestTurmaACC = {
  ...sampleWithRequiredData,
  inicio: sampleWithRequiredData.inicio?.format(DATE_FORMAT),
  termino: sampleWithRequiredData.termino?.format(DATE_FORMAT),
};

describe('TurmaACC Service', () => {
  let service: TurmaACCService;
  let httpMock: HttpTestingController;
  let expectedResult: ITurmaACC | ITurmaACC[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TurmaACCService);
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

    it('should create a TurmaACC', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const turmaACC = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(turmaACC).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TurmaACC', () => {
      const turmaACC = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(turmaACC).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TurmaACC', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TurmaACC', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TurmaACC', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTurmaACCToCollectionIfMissing', () => {
      it('should add a TurmaACC to an empty array', () => {
        const turmaACC: ITurmaACC = sampleWithRequiredData;
        expectedResult = service.addTurmaACCToCollectionIfMissing([], turmaACC);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(turmaACC);
      });

      it('should not add a TurmaACC to an array that contains it', () => {
        const turmaACC: ITurmaACC = sampleWithRequiredData;
        const turmaACCCollection: ITurmaACC[] = [
          {
            ...turmaACC,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTurmaACCToCollectionIfMissing(turmaACCCollection, turmaACC);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TurmaACC to an array that doesn't contain it", () => {
        const turmaACC: ITurmaACC = sampleWithRequiredData;
        const turmaACCCollection: ITurmaACC[] = [sampleWithPartialData];
        expectedResult = service.addTurmaACCToCollectionIfMissing(turmaACCCollection, turmaACC);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(turmaACC);
      });

      it('should add only unique TurmaACC to an array', () => {
        const turmaACCArray: ITurmaACC[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const turmaACCCollection: ITurmaACC[] = [sampleWithRequiredData];
        expectedResult = service.addTurmaACCToCollectionIfMissing(turmaACCCollection, ...turmaACCArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const turmaACC: ITurmaACC = sampleWithRequiredData;
        const turmaACC2: ITurmaACC = sampleWithPartialData;
        expectedResult = service.addTurmaACCToCollectionIfMissing([], turmaACC, turmaACC2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(turmaACC);
        expect(expectedResult).toContain(turmaACC2);
      });

      it('should accept null and undefined values', () => {
        const turmaACC: ITurmaACC = sampleWithRequiredData;
        expectedResult = service.addTurmaACCToCollectionIfMissing([], null, turmaACC, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(turmaACC);
      });

      it('should return initial array if no TurmaACC is added', () => {
        const turmaACCCollection: ITurmaACC[] = [sampleWithRequiredData];
        expectedResult = service.addTurmaACCToCollectionIfMissing(turmaACCCollection, undefined, null);
        expect(expectedResult).toEqual(turmaACCCollection);
      });
    });

    describe('compareTurmaACC', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTurmaACC(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTurmaACC(entity1, entity2);
        const compareResult2 = service.compareTurmaACC(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTurmaACC(entity1, entity2);
        const compareResult2 = service.compareTurmaACC(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTurmaACC(entity1, entity2);
        const compareResult2 = service.compareTurmaACC(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
