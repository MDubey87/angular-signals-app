import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Course } from '../models/course.model';
import { createCourse } from '../../../server/create-course.route';

@Injectable({
  providedIn: 'root',
})
export class CoursesServiceWithFetch {
  env = environment;
  async loadAllCourses(): Promise<Course[]> {
    const response = await fetch(`${this.env.apiRoot}/courses`);
    const body = await response.json();
    return body.courses;
  }

  async loadCourseById(courseId: string): Promise<Course> {
    const response = await fetch(`${this.env.apiRoot}/courses/${courseId}`);
    const body = await response.json();
    return body.course;
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    const response = await fetch(`${this.env.apiRoot}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });
    const body = await response.json();
    return body.course;
  }
  async updateCourse(
    courseId: string,
    course: Partial<Course>,
  ): Promise<Course> {
    const response = await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });
    const body = await response.json();
    return body.course;
  }
  async deleteCourse(courseId: string): Promise<void> {
    const response = await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
