import { Component, OnInit, Inject } from '@angular/core';
import { CoursesService } from '../courses.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-course-plan',
  templateUrl: './course-plan.component.html',
  styleUrls: ['./course-plan.component.scss']
})
export class CoursePlanComponent implements OnInit {
  terms: any[] = [
    {
      name: '1A',
      courses: [
        { subject: 'MATH', catalog_number: '135' },
        { subject: 'MATH', catalog_number: '239' }
      ]
    },
    {
      name: '1B',
      courses: [
        { subject: 'MATH', catalog_number: '135' },
        { subject: 'MATH', catalog_number: '239' }
      ]
    }
  ];

  public allCourses: any[] = [];
  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog
  ) {
    coursesService.getAllCourses().subscribe(data => {
      this.allCourses = data;
      console.log(this.allCourses);
    });
  }

  ngOnInit(): void {}

  addTerm(): void {
    this.terms.push({ name: 'Untitled', courses: [] });
  }

  addCourse(term: any): void {
    // term.courses.push({ subject: 'TEST', catalog_number: '101' });
    const dialogRef = this.dialog.open(AddCourseDialogComponent, {
      width: '250px',
      data: { term }
    });

    dialogRef.afterClosed().subscribe(result => {
      const course = this.coursesService.lookupByCode(this.allCourses, result);
      if (course) {
        term.courses.push(course);
      }
    });
  }
}

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
