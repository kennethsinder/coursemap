import { TestBed, async } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatGridListModule,
  MatCardModule,
  MatListModule,
  MatIconModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CoursesService } from './courses.service';
import { CoursePlanComponent } from './course-plan/course-plan.component';

describe('AppComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent, CoursePlanComponent],
        imports: [
          BrowserAnimationsModule,
          BrowserModule,
          FormsModule,
          HttpModule,
          MatButtonModule,
          MatCheckboxModule,
          MatGridListModule,
          MatCardModule,
          MatListModule,
          MatIconModule
        ],
        exports: [],
        providers: [CoursesService],
        bootstrap: [AppComponent]
      }).compileComponents();
    })
  );

  it(
    'should create the app',
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );

  it(
    `should have as title 'app works!'`,
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app.title).toEqual('CourseMap');
    })
  );

  it(
    'should render title in a h1 tag',
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain('CourseMap');
    })
  );
});
