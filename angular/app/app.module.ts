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
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CoursesService } from './courses.service';
import {
  CoursePlanComponent,
  AddCourseDialogComponent
} from './course-plan/course-plan.component';

export const appModule: object = {
  declarations: [AppComponent, CoursePlanComponent, AddCourseDialogComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    MatCardModule,
    MatListModule,
    MatIconModule
  ],
  entryComponents: [AddCourseDialogComponent],
  exports: [],
  providers: [CoursesService],
  bootstrap: [AppComponent]
};

@NgModule(appModule)
export class AppModule {}
