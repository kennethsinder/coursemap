import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Course } from './course';

// jQuery
declare var $: any;

@Injectable()
export class CoursesService {
  constructor(private http: Http) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get('/api/courses').map((res: any) => res.json());
  }

  lookupByCode(courses: Course[], courseCode: string): Course {
    if (!courseCode || !courses) {
      return;
    }
    const splitCode = courseCode.split(/\s+/);
    if (!splitCode || splitCode.length !== 2) {
      return;
    }
    for (const course of courses) {
      if (
        course.subject.toLowerCase() === splitCode[0].toLowerCase() &&
        course.catalog_number === splitCode[1]
      ) {
        return course;
      }
    }
  }

  parseReqs(reqs: any): any[] {
    // Code from GitHub gist: https://gist.github.com/hxhl95/6151081

    reqs = reqs.replace(/prereq:/gi, '');
    reqs = reqs.replace(/([\/,;])/g, '$1 ');
    if (!(reqs = reqs.match(/^.*[0-9]{2,3}[A-Z\)]*(.*\))*/))) {
      return [];
    }
    reqs = reqs[0];

    const engcards = { one: 1, two: 2, three: 3, '1': 1, '2': 2, '3': 3 };
    reqs = reqs.replace(/(,\s*)(one|two|three|1|2|3)( of)/gi, ' and $2$3');

    let pstmp;
    while (
      reqs !==
      (pstmp = reqs.replace(
        /^(^|.*[^A-Z])([A-Z]{2,})(([^A-Z][A-Z]?)+)([\/\s]+)([0-9]{2,3})/,
        '$1$2$3$5$2 $6'
      ))
    ) {
      reqs = pstmp;
    }
    while (
      reqs !==
      (pstmp = reqs.replace(
        /([A-Z]{2,})([,\/\s]+[^0-9]+)([0-9]{2,3})/,
        '$1 $3$2$3'
      ))
    ) {
      reqs = pstmp;
    }

    const parse = reqs => {
      reqs = $.trim(reqs);

      let tokens;
      if ((tokens = /^\(([^\(\)]+|(\(.+\).*)*)\)$/.exec(reqs))) {
        return parse(tokens[1]);
      }

      const seps = [
        [';', []],
        ['and', []],
        ['\\&', []],
        [],
        [',', []],
        ['or', [1]],
        ['\\/', [1]]
      ];
      for (let i = 0; i < seps.length; i++) {
        if (seps[i].length === 0) {
          if ((tokens = /^(one|two|three|1|2|3) of(.+)$/gi.exec(reqs))) {
            return (pstmp = parse(
              tokens[2].replace(/,(?=[^\)]*(?:\(|$))/g, ' or')
            )).length === 1
              ? pstmp
              : $.merge([engcards[tokens[1].toLowerCase()]], pstmp.splice(1));
          }
        } else if (
          (tokens = reqs.split(
            new RegExp(seps[i][0] + '(?=[^\\)]*(?:\\(|$))', 'i')
          ))[0] !== reqs
        ) {
          return $.merge(
            seps[i][1],
            $.map(tokens, x => {
              const r = parse(x),
                e = seps[i][1].length === 0;
              if (!r || (r.length === 1 && !isNaN(r[0]))) {
                return;
              }
              return (e && !isNaN(r[0])) || (!e && r.length > 1) ? [r] : r;
            })
          );
        }
      }

      reqs = reqs.replace(/\W/g, '');
      if ((tokens = reqs.match(/[A-Z]{2,}[0-9]{2,3}[A-Z]*/))) {
        return [tokens[0]];
      }
      return;
    };

    return parse(reqs);
  }
}
