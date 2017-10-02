import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class CoursesService {

  constructor(
    private http: Http
  ) { }

  getAllCourses() {
    return this.http.get('/api/courses')
      .map((res: any) => res.json())
      .subscribe(
        (data) => { console.log(data); }
      );
  }

}
