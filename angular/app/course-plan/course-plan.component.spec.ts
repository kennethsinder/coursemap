import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatGridListModule,
  MatCardModule,
  MatListModule,
  MatIconModule
} from '@angular/material';
import { CoursePlanComponent } from './course-plan.component';

describe('CoursePlanComponent', () => {
  let component: CoursePlanComponent;
  let fixture: ComponentFixture<CoursePlanComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CoursePlanComponent],
        imports: [
          MatButtonModule,
          MatCheckboxModule,
          MatGridListModule,
          MatCardModule,
          MatListModule,
          MatIconModule
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
