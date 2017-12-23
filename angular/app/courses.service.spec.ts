import { TestBed, inject } from '@angular/core/testing';
import { Http, XHRBackend, BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { CoursesService } from './courses.service';
import { Course } from './course';

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
        },
        BaseRequestOptions,
        CoursesService,
        MockBackend,
      ],
    });

    service = TestBed.get(CoursesService);
  });

  it('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getAllCourses', () => {
    it('should be a function', () => {
      expect(service.getAllCourses).toBeTruthy();
      expect(typeof service.getAllCourses).toBe('function');
    });
  });

  describe('Method: coursesEqual', () => {
    it('should return false for unrelated courses', () => {
      const c1: Course = { subject: 'MATH', catalog_number: '135', id: 1 };
      const c2: Course = { subject: 'ECON', catalog_number: '101', id: 2 };
      expect(service.coursesEqual(c1, c2)).toBe(false);
    });

    it('should return true for the same coded course', () => {
      const c1: Course = { subject: 'MATH', catalog_number: '239', id: 3 };
      const c2: Course = { subject: 'MATH', catalog_number: '239', id: 4 };
      expect(service.coursesEqual(c1, c2)).toBe(true);
    });

    it('should return true for courses that differ by casing', () => {
      const c1: Course = { subject: 'MATH', catalog_number: '239', id: 3 };
      const c2: Course = { subject: 'math', catalog_number: '239', id: 4 };
      expect(service.coursesEqual(c1, c2)).toBe(true);
    });
  });

  describe('Method: courseEqualsArray', () => {
    it('should return false for unrelated courses', () => {
      const c1: Course = { subject: 'MATH', catalog_number: '135', id: 1 };
      const c2: string[] = ['MATH', '117'];
      expect(service.courseEqualsArray(c1, c2)).toBe(false);
    });

    it('should return true for courses that differ only by casing', () => {
      const c1: Course = { subject: 'MATH', catalog_number: '135B', id: 1 };
      const c2: string[] = ['math', '135b'];
      expect(service.courseEqualsArray(c1, c2)).toBe(true);
    });
  });

  describe('Method: lookupByCode', () => {
    it('should return falsy if there are no courses', () => {
      const courses: Course[] = [];
      const courseCode = 'MATH 135';
      expect(service.lookupByCode(courses, courseCode)).toBeFalsy();
    });

    it('should return falsy if the course does not exist', () => {
      const c1: Course = { subject: 'MATH', catalog_number: '135', id: 1 };
      const c2: Course = { subject: 'MATH', catalog_number: '239', id: 1 };
      const courses: Course[] = [c1, c2];
      const courseCode = 'MATH 117';
      expect(service.lookupByCode(courses, courseCode)).toBeFalsy();
    });

    it('should return the course if there is a match', () => {
      const c1: Course = { subject: 'MATH', catalog_number: '135', id: 1 };
      const c2: Course = { subject: 'MATH', catalog_number: '239', id: 1 };
      const courses: Course[] = [c1, c2];
      const courseCode = 'math  239';
      expect(service.lookupByCode(courses, courseCode)).toBe(c2);
    });
  });

  describe('Method: getReqsForCourse', () => {
    it('should return a bare object if there are no requisites', () => {
      const course: Course = {
        subject: 'MATH',
        catalog_number: '135',
        id: 1,
        prerequisites: 'none',
        corequisites: 'none',
        antirequisites: 'none',
      };
      const result: object = service.getReqsForCourse(course);
      expect(Object.keys(result).length).toBe(3);
      expect(result['prerequisites']).toEqual([]);
      expect(result['corequisites']).toEqual([]);
      expect(result['antirequisites']).toEqual([]);
    });

    it('should return object with null values if there are no requisites set', () => {
      const course: Course = { subject: 'MATH', catalog_number: '135', id: 1 };
      const result: object = service.getReqsForCourse(course);
      expect(Object.keys(result).length).toBe(3);
      expect(result['prerequisites']).toBe(null);
      expect(result['corequisites']).toBe(null);
      expect(result['antirequisites']).toBe(null);
    });
  });

  describe('Method: removeFromReqs', () => {
    it('should return an empty array if there are no reqs', () => {
      const course: Course = { subject: 'MATH', catalog_number: '135', id: 1 };
      expect(service.removeFromReqs([], course)).toEqual([]);
    });

    it('should return an empty array if there is an OR statement match', () => {
      const course: Course = { subject: 'MATH', catalog_number: '135', id: 1 };
      const reqs = [1, 'MATH239', 'MATH135'];
      expect(service.removeFromReqs(reqs, course)).toEqual([]);
    });

    it('should return an unchanged array if there is no OR match', () => {
      const course: Course = { subject: 'MATH', catalog_number: '135', id: 1 };
      const reqs = [1, 'MATH239', 'MATH117'];
      const result = service.removeFromReqs(reqs, course);
      expect(result).toEqual(reqs);
      expect(result.length).toBe(3);
    });

    it('should remove a matched entry from an AND list', () => {
      const course: Course = { subject: 'MATH', catalog_number: '135', id: 1 };
      const reqs = ['MATH239', 'MATH135'];
      const result = service.removeFromReqs(reqs, course);
      expect(result).toEqual(['MATH239']);
      expect(result.length).toBe(1);
    });
  });

  describe('Method: parseReqs', () => {
    it(
      'should return an empty array for no requisites',
      inject([CoursesService], (service: CoursesService) => {
        expect(service.parseReqs('')).toEqual([]);
      })
    );

    it('should return a singleton array for 1 course', () => {
      expect(service.parseReqs('MATH 239')).toEqual(['MATH239']);
    });
  });
});
