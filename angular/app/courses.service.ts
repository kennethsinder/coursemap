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

  /**
   * Gets all courses from the backend
   */
  getAllCourses(): Observable<Course[]> {
    return this.http.get('/api/courses').map((res: any) => res.json());
  }

  /**
   * Returns true iff the two arguments are the same course.
   * @param c1 Left-hand side course
   * @param c2 Right-hand side course
   */
  coursesEqual(c1: Course, c2: Course): boolean {
    return (
      c1.subject.toLowerCase() === c2.subject.toLowerCase() &&
      c1.catalog_number.toLowerCase() === c2.catalog_number.toLowerCase()
    );
  }

  /**
   * Returns true iff the two arguments are the same course.
   * @param c1 Left-hand side Course
   * @param c2 2-array of [subject, catalog_number] strings
   */
  courseEqualsArray(c1: Course, c2: string[]): boolean {
    return (
      c1.subject.toLowerCase() === c2[0].toLowerCase() &&
      c1.catalog_number.toLowerCase() === c2[1].toLowerCase()
    );
  }

  /**
   * Returns the Course object for the given course code.
   * @param courses The haystack of courses to search in
   * @param courseCode String course code e.g. "MATH 239"
   */
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

  /**
   * Returns pre-, co-, and anti-requisite trees in a convenient data object,
   * given a course.
   * @param course The course for which we want to build req trees
   */
  getReqsForCourse(course: Course): { [key: string]: any[] } {
    return {
      prerequisites: course.prerequisites ? this.parseReqs(course.prerequisites) : null,
      antirequisites: course.antirequisites ? this.parseReqs(course.antirequisites) : null,
      corequisites: course.corequisites ? this.parseReqs(course.corequisites) : null,
    };
  }

  /**
   * Returns a simplified version of the given req tree, that
   * does not contain a course code string that equals the given `course`.
   * @param reqs The req tree to mutate
   * @param course The course to remove
   */
  removeFromReqs(reqs: any, course: Course): any {
    // Base cases
    if (!reqs || (Array.isArray(reqs) && !reqs.length)) {
      return [];
    }
    if (reqs !== null && typeof reqs === 'object' && !Array.isArray(reqs)) {
      return this.coursesEqual(course, reqs) ? [] : reqs;
    }
    if (typeof reqs === 'string' || reqs instanceof String) {
      return this.courseEqualsArray(course, reqs.match(/([A-Z]+)(.+)/i).slice(1)) ? [] : reqs;
    }

    // Recursive cases
    if (Number(reqs[0]) === 1) {
      // 1 at the beginning of a reqs array means "one of"
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

  /**
   * Recursive helper method that returns a formatted course code string
   * if the given course is found within the given requisite tree, or
   * false otherwise.
   * @param course The course to search with
   * @param reqs A requisite tree containing course strings
   */
  courseInReqTree(course: Course, reqs: any[]): string | boolean {
    if ((typeof reqs === 'string' || reqs instanceof String) && reqs != null) {
      const matches = reqs.match(/([A-Z]+)(.+)/i);
      return matches && matches.length > 2 && this.courseEqualsArray(course, matches.slice(1))
        ? String(reqs)
        : false;
    }

    if (reqs !== null && typeof reqs === 'object' && !Array.isArray(reqs)) {
      return this.coursesEqual(course, reqs)
        ? `${(reqs as Course).subject} ${(reqs as Course).catalog_number}`
        : false;
    }

    if (!reqs || (Array.isArray(reqs) && !reqs.length)) {
      return false;
    }

    for (const entry of reqs) {
      const result = this.courseInReqTree(course, entry);
      if (result) {
        return result;
      }
    }
    return false;
  }

  /**
   * Returns true iff the course is in the term.
   * @param course The course to check membership with
   * @param term The term in which to look
   */
  courseInTerm(course: Course, term: Term): boolean {
    for (const c of term.courses) {
      if (this.coursesEqual(c, course)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Return list of Terms that are before the given course
   * @param course The Course to compare with
   * @param terms The terms to filter from
   * @param inclusive Whether to include the term with `course` in it
   */
  earlierTerms(course: Course, terms: Term[], inclusive: boolean = false): Term[] {
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

  /**
   * Return whether ALL known requisites for the given course are met
   * by the other courses in the given `terms` array.
   * @param course Specific course for which to check validity
   * @param terms Terms of courses with which to verify
   */
  reqsMetForCourse(course: Course, terms: Term[]): boolean {
    // Obtain pre-, co-, and anti-reqs using req parsing algo and bind them to an object
    const reqs = this.getReqsForCourse(course);

    // Go through all previous courses and remove met prerequisites
    for (const term of this.earlierTerms(course, terms)) {
      for (const termCourse of term.courses) {
        reqs.prerequisites = this.removeFromReqs(reqs.prerequisites, termCourse);
      }
    }
    if (reqs.prerequisites.length) {
      course.error = 'Missing prerequisite';
    }

    // Go through all previous courses and this term, and remove met corequisites
    for (const term of this.earlierTerms(course, terms, true)) {
      for (const termCourse of term.courses) {
        reqs.corequisites = this.removeFromReqs(reqs.corequisites, termCourse);
      }
    }
    if (reqs.corequisites.length) {
      course.error = 'Missing corequisite';
    }

    // Go through all terms and see if any antireqs match
    for (const term of terms) {
      for (const termCourse of term.courses) {
        const conflict = this.courseInReqTree(termCourse, reqs.antirequisites);
        if (conflict) {
          course.error = `Taking antirequisite ${conflict}`;
          return false;
        }
      }
    }

    // Return True iff all reqs are met for the given `course` in appropriate `terms`
    return !reqs.prerequisites.length && !reqs.corequisites.length;
  }

  /**
   * Return true iff all requisites for all courses for all given
   * terms are met. Also mutates the courses and terms to insert
   * any errors found if we return false here.
   * @param terms Terms of courses to verify
   */
  areReqsMet(terms: Term[]): boolean {
    let result = true;
    for (const term of terms) {
      for (const course of term.courses) {
        if (!this.reqsMetForCourse(course, terms)) {
          term.error = course.error || 'Requisites error';
          result = false;
        }
      }
    }
    return result;
  }

  /**
   * Returns a requisites tree formed from the given human
   * readable requisites string.
   * @param reqs Requisites as a human-readable stsring
   */
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
      reqs !== (pstmp = reqs.replace(/([A-Z]{2,})([,\/\s]+[^0-9]+)([0-9]{2,3})/, '$1 $3$2$3'))
    ) {
      reqs = pstmp;
    }

    const parse = reqs => {
      reqs = $.trim(reqs);

      let tokens;
      if ((tokens = /^\(([^\(\)]+|(\(.+\).*)*)\)$/.exec(reqs))) {
        return parse(tokens[1]);
      }

      const seps = [[';', []], ['and', []], ['\\&', []], [], [',', []], ['or', [1]], ['\\/', [1]]];
      for (let i = 0; i < seps.length; i++) {
        if (seps[i].length === 0) {
          if ((tokens = /^(one|two|three|1|2|3) of(.+)$/gi.exec(reqs))) {
            return (pstmp = parse(tokens[2].replace(/,(?=[^\)]*(?:\(|$))/g, ' or'))).length === 1
              ? pstmp
              : $.merge([engcards[tokens[1].toLowerCase()]], pstmp.splice(1));
          }
        } else if (
          (tokens = reqs.split(new RegExp(seps[i][0] + '(?=[^\\)]*(?:\\(|$))', 'i')))[0] !== reqs
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
