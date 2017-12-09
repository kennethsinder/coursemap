import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatGridListModule,
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatTooltipModule,
} from '@angular/material';
import { CoursePlanComponent } from './course-plan.component';
import { CoursesService } from '../courses.service';
import { appModule } from '../app.module';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, XHRBackend, Http } from '@angular/http';

describe('CoursePlanComponent', () => {
  let component: CoursePlanComponent;
  let fixture: ComponentFixture<CoursePlanComponent>;

  beforeEach(
    async(() => {
      const mod = Object.assign({}, appModule);
      (mod as any).providers.push(MockBackend);
      (mod as any).providers.push(BaseRequestOptions);
      (mod as any).providers.push({
        provide: Http,
        deps: [MockBackend, BaseRequestOptions],
        useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        },
      });
      TestBed.configureTestingModule(mod).compileComponents();
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
