import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CoursesService } from '../courses.service';
import { Course } from '../course';
import { Term } from '../term';

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

  addTerm(): void {
    this.terms.push({ name: 'Untitled', courses: [], error: null });
  }

  getTotalUnits(term: Term) {
    let result = 0;
    for (const course of term.courses) {
      result += Number(course.units);
    }
    return result;
  }

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

      term.error = null;
      course.error = null;
      this.coursesService.areReqsMet(this.terms);
    });
  }

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

      course.error = null;
      term.error = null;
      this.coursesService.areReqsMet(this.terms);
    });
  }
}

// -------------------------------------------------------------
@Component({
  selector: 'app-add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
})
export class AddCourseDialogComponent {
  newCourse: string;

  constructor(
    public dialogRef: MatDialogRef<AddCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
// -------------------------------------------------------------

// -------------------------------------------------------------
@Component({
  selector: 'app-view-course-dialog',
  templateUrl: './view-course-dialog.component.html',
})
export class ViewCourseDialogComponent implements OnInit {
  course: Course;

  constructor(
    public dialogRef: MatDialogRef<ViewCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.course = this.data.course;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
// -------------------------------------------------------------
