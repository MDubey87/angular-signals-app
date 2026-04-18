import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Course } from '../models/course.model';
import { GetCoursesResponse } from '../models/get-courses.response';
import { SkipLoading } from '../loading/skip-loading.component';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  httpClient = inject(HttpClient);
  env = environment;
  async loadAllCourses(): Promise<Course[]> {
    const courses$ = this.httpClient.get<GetCoursesResponse>(
      `${this.env.apiRoot}/courses`,
      // {
      //   // context: new HttpContext().set(SkipLoading, true),
      // },
    );
    const response = await firstValueFrom(courses$);
    return response.courses;
  }

  async loadCourseById(courseId: string): Promise<Course> {
    const courses$ = this.httpClient.get<Course>(
      `${this.env.apiRoot}/courses/${courseId}`,
    );
    const response = await firstValueFrom(courses$);
    return response;
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    const courses$ = this.httpClient.post<Course>(
      `${this.env.apiRoot}/courses`,
      course,
    );
    const body = await firstValueFrom(courses$);
    return body;
  }

  async updateCourse(
    courseId: string,
    course: Partial<Course>,
  ): Promise<Course> {
    const courses$ = this.httpClient.put<Course>(
      `${this.env.apiRoot}/courses/${courseId}`,
      course,
    );
    const body = await firstValueFrom(courses$);
    return body;
  }

  async deleteCourse(courseId: string): Promise<void> {
    const courses$ = this.httpClient.delete(
      `${this.env.apiRoot}/courses/${courseId}`,
    );
    await firstValueFrom(courses$);
  }
}
