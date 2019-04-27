import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatGridListModule,
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AddCourseDialogComponent } from './course-plan/add-course-dialog/add-course-dialog.component';
import { AppComponent } from './app.component';
import { CoursesService } from './courses.service';
import { CoursePlanComponent } from './course-plan/course-plan.component';
import { ViewCourseDialogComponent } from './course-plan/view-course-dialog/view-course-dialog.component';

export const appModule: object = {
  declarations: [
    AppComponent,
    CoursePlanComponent,
    AddCourseDialogComponent,
    ViewCourseDialogComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  entryComponents: [AddCourseDialogComponent, ViewCourseDialogComponent],
  exports: [],
  providers: [CoursesService],
  bootstrap: [AppComponent],
};

@NgModule(appModule)
export class AppModule {}
