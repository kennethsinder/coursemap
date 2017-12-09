import { TestBed, inject } from '@angular/core/testing';
import { Http, XHRBackend, BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { CoursesService } from './courses.service';

describe('CoursesService', () => {
  let service;

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
    inject([CoursesService], (_service: CoursesService) => {
      service = _service;
    });
  });

  it(
    'should inject CoursesService',
    inject([CoursesService], (service: CoursesService) => {
      expect(service).toBeTruthy();
    })
  );

  describe('Method: parseReqs', () => {
    it(
      'should return an empty array for no requisites',
      inject([CoursesService], (service: CoursesService) => {
        expect(service.parseReqs('')).toEqual([]);
      })
    );

    it(
      'should return a singleton array for 1 course',
      inject([CoursesService], (service: CoursesService) => {
        expect(service.parseReqs('MATH 239')).toEqual(['MATH239']);
      })
    );
  });
});
