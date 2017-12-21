import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
