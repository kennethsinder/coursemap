import { Component } from '@angular/core';
import { CoursesService } from './courses.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Welcome!';
  courses = null;

  constructor(private coursesService: CoursesService) {
    coursesService.getAllCourses();
  }
}
