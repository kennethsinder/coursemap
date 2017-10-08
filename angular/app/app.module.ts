import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule,MatCheckboxModule, MatGridListModule,
  MatCardModule, MatListModule, MatIconModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CoursesService } from './courses.service';
import { CoursePlanComponent } from './course-plan/course-plan.component';

@NgModule({
  declarations: [
    AppComponent,
    CoursePlanComponent
  ],
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
})
export class AppModule { }
