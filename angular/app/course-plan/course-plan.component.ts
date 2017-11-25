import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CoursesService } from '../courses.service';
import { Course } from '../course';
import { Term } from '../term';

@Component({
  selector: 'app-course-plan',
  templateUrl: './course-plan.component.html',
  styleUrls: ['./course-plan.component.scss']
})
export class CoursePlanComponent implements OnInit {
  terms: Term[] = [
    {
      name: '1A',
      courses: []
    }
  ];

  public allCourses: Course[] = [];

  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog
  ) {
    coursesService.getAllCourses().subscribe(data => (this.allCourses = data));
  }

  ngOnInit(): void {}

  addTerm(): void {
    this.terms.push({ name: 'Untitled', courses: [] });
  }

  addCourse(term: any): void {
    const dialogRef = this.dialog.open(AddCourseDialogComponent, {
      width: '300px',
      data: { term }
    });

    dialogRef.afterClosed().subscribe(result => {
      const course = this.coursesService.lookupByCode(this.allCourses, result);
      if (course) {
        term.courses.push(course);
      }
    });
  }

  showCourse(course: Course) {
    const dialogRef = this.dialog.open(ViewCourseDialogComponent, {
      width: '400px',
      data: { course }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}

// -------------------------------------------------------------
@Component({
  selector: 'app-add-course-dialog',
  templateUrl: './add-course-dialog.component.html'
})
export class AddCourseDialogComponent {
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
  templateUrl: './view-course-dialog.component.html'
})
export class ViewCourseDialogComponent implements OnInit {
  course: Course;

  constructor(
    public dialogRef: MatDialogRef<ViewCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.course = this.data.course;
    console.log(this.course.subject);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
// -------------------------------------------------------------
