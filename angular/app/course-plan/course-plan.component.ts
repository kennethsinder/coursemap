import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-plan',
  templateUrl: './course-plan.component.html',
  styleUrls: ['./course-plan.component.scss']
})
export class CoursePlanComponent implements OnInit {

	terms: any[] = [
		{
			name: '1A',
			courses: [{subject: 'MATH', catalog_number: '135'},
				{subject: 'MATH', catalog_number: '239'}],
		},
		{
			name: '1B',
			courses: [{subject: 'MATH', catalog_number: '135'},
				{subject: 'MATH', catalog_number: '239'}],
		}
	]

  constructor() { }

  ngOnInit() {
  }

  addTerm() {
  	this.terms.push({name: 'Untitled', courses: []});
  }

  addCourse(term: any) {
  	term.courses.push({subject: 'TEST', catalog_number: '101'});
  }

}
