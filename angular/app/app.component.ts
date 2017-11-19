import { Component } from '@angular/core';
import { CoursesService } from './courses.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CourseMap';
  courses: any[] = [];

  constructor(private coursesService: CoursesService) {
    coursesService.getAllCourses().subscribe(data => {
      this.courses = data;
      console.log(this.courses);
    });
  }
}
