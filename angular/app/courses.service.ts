import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Course } from './course';
import { Term } from './term';

// jQuery
declare var $: any;

@Injectable()
export class CoursesService {
  constructor(private http: Http) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get('/api/courses').map((res: any) => res.json());
  }

  coursesEqual(c1: Course, c2: Course): boolean {
    return (
      c1.subject.toLowerCase() === c2.subject.toLowerCase() &&
      c1.catalog_number.toLowerCase() === c2.catalog_number.toLowerCase()
    );
  }

  courseEqualsArray(c1: Course, c2: string[]): boolean {
    return (
      c1.subject.toLowerCase() === c2[0].toLowerCase() &&
      c1.catalog_number.toLowerCase() === c2[1].toLowerCase()
    );
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

  getReqsForCourse(course: Course): { [key: string]: any[] } {
    return {
      prerequisites: course.prerequisites
        ? this.parseReqs(course.prerequisites)
        : null,
      antirequisites: course.antirequisites
        ? this.parseReqs(course.antirequisites)
        : null,
      corequisites: course.corequisites
        ? this.parseReqs(course.corequisites)
        : null
    };
  }

  removeFromReqs(reqs: any, course: Course): any {
    if (!reqs || (Array.isArray(reqs) && !reqs.length)) {
      return [];
    }
    if (reqs !== null && typeof reqs === 'object' && !Array.isArray(reqs)) {
      return this.coursesEqual(course, reqs) ? [] : reqs;
    }
    if (typeof reqs === 'string' || reqs instanceof String) {
      return this.courseEqualsArray(
        course,
        reqs.match(/([A-Z]+)(.+)/i).slice(1)
      )
        ? []
        : reqs;
    }
    if (Number(reqs[0]) === 1) {
      for (let i = 1; i < reqs.length; ++i) {
        reqs[i] = this.removeFromReqs(reqs[i], course);
        if (!reqs[i] || !reqs[i].length) {
          return [];
        }
      }
      return reqs;
    }
    const updatedReqs: any[] = [];
    for (let i = 0; i < reqs.length; ++i) {
      reqs[i] = this.removeFromReqs(reqs[i], course);
      if (reqs[i] && reqs[i].length) {
        updatedReqs.push(reqs[i]);
      }
    }
    return updatedReqs;
  }

  courseInReqTree(course: Course, reqs: any[]) {
    if (typeof reqs === 'string' || reqs instanceof String) {
      return this.courseEqualsArray(
        course,
        reqs.match(/([A-Z]+)(.+)/i).slice(1)
      );
    }

    if (reqs !== null && typeof reqs === 'object' && !Array.isArray(reqs)) {
      return this.coursesEqual(course, reqs);
    }

    if (!reqs || (Array.isArray(reqs) && !reqs.length)) {
      return [];
    }

    for (const entry of reqs) {
      if (this.courseInReqTree(course, entry)) {
        return true;
      }
    }
    return false;
  }

  courseInTerm(course: Course, term: Term): boolean {
    for (const c of term.courses) {
      if (this.coursesEqual(c, course)) {
        return true;
      }
    }
    return false;
  }

  earlierTerms(
    course: Course,
    terms: Term[],
    inclusive: boolean = false
  ): Term[] {
    const result: Term[] = [];
    for (const term of terms) {
      if (!this.courseInTerm(course, term)) {
        result.push(term);
      } else {
        if (inclusive) {
          result.push(term);
        }
        break;
      }
    }
    return result;
  }

  reqsMetForCourse(course: Course, terms: Term[]): boolean {
    // Obtain pre-, co-, and anti-reqs using req parsing algo and bind them to an object
    const reqs = this.getReqsForCourse(course);

    // Go through all previous courses and remove met prerequisites
    for (const term of this.earlierTerms(course, terms)) {
      for (const termCourse of term.courses) {
        reqs.prerequisites = this.removeFromReqs(
          reqs.prerequisites,
          termCourse
        );
      }
    }

    // Go through all previous courses and this term, and remove met corequisites
    for (const term of this.earlierTerms(course, terms, true)) {
      for (const termCourse of term.courses) {
        reqs.corequisites = this.removeFromReqs(reqs.corequisites, termCourse);
      }
    }

    // Go through all terms and see if any antireqs match
    for (const term of terms) {
      for (const termCourse of term.courses) {
        if (this.courseInReqTree(termCourse, reqs.antirequisites)) {
          return false;
        }
      }
    }

    // Return True iff all reqs are met for the given `course` in appropriate `terms`
    console.log(reqs);
    return !reqs.prerequisites.length && !reqs.corequisites.length;
  }

  areReqsMet(terms: Term[]): boolean {
    for (const term of terms) {
      for (const course of term.courses) {
        if (!this.reqsMetForCourse(course, terms)) {
          return false;
        }
      }
    }
    return true;
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
