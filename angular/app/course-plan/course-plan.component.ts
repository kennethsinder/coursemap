import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AddCourseDialogComponent } from './add-course-dialog/add-course-dialog.component';
import { CoursesService } from '../courses.service';
import { Course } from '../course';
import { Term } from '../term';
import { ViewCourseDialogComponent } from './view-course-dialog/view-course-dialog.component';

@Component({
  selector: 'app-course-plan',
  templateUrl: './course-plan.component.html',
  styleUrls: ['./course-plan.component.scss'],
})
export class CoursePlanComponent implements OnInit {
  terms: Term[] = [
    {
      name: '1A',
      courses: [],
      error: null,
    },
  ];

  public allCourses: Course[] = [];

  constructor(private coursesService: CoursesService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.coursesService.getAllCourses().subscribe(data => (this.allCourses = data));
  }

  /**
   * Add new Term to terms array.
   */
  addTerm(): void {
    this.terms.push({ name: 'Untitled', courses: [], error: null });
  }

  /**
   * Returns the total number of course units in a given Term.
   * @param term Term over which to total the units
   */
  getTotalUnits(term: Term) {
    let result = 0;
    for (const course of term.courses) {
      result += Number(course.units);
    }
    return result;
  }

  /**
   * Helper method to update errors for all courses in all terms.
   * @param modifiedTerm Term for which to clear errors, if desired
   * @param modifiedCourse Course for which to clear errors, if desired
   */
  private updateReqErrors(modifiedTerm?: Term, modifiedCourse?: Course) {
    if (modifiedTerm) {
      modifiedTerm.error = null;
    }

    if (modifiedCourse) {
      modifiedCourse.error = null;
    }

    this.coursesService.areReqsMet(this.terms);
  }

  /**
   * Opens a dialog to handle adding an input Course to a given Term.
   * @param term Term to which a course should be added
   */
  addCourse(term: any): void {
    const dialogRef = this.dialog.open(AddCourseDialogComponent, {
      width: '300px',
      data: { term },
    });

    dialogRef.afterClosed().subscribe(result => {
      const course = this.coursesService.lookupByCode(this.allCourses, result);
      if (course) {
        term.courses.push(course);
      }

      this.updateReqErrors(term, course);
    });
  }

  /**
   * Shows a details dialog to view and optionally delete a given Course.
   * @param term Term for which the given Course is scheduled
   * @param course The Course for which to show details.
   */
  showCourse(term: Term, course: Course) {
    const dialogRef = this.dialog.open(ViewCourseDialogComponent, {
      width: '400px',
      data: { course },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = term.courses.indexOf(course);
        if (index !== -1) {
          term.courses.splice(index, 1);
        }
      }

      this.updateReqErrors(term, course);
    });
  }
}
