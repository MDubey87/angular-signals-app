import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, interval, startWith, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  #courses = signal<Course[]>([]);
  coursesService = inject(CoursesService);
  messageService = inject(MessagesService);
  dialog = inject(MatDialog);
  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });
  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });
  constructor() {
    // effect(() => {
    //   console.log('Beginner courses:', this.beginnerCourses());
    //   console.log('Advanced courses:', this.advancedCourses());
    // });
    this.loadCourses().then(() => {
      //console.log('Courses loaded successfully', this.#courses());
    });
  }

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (error) {
      this.messageService.showMessage('Error loading courses!', 'error');
      console.error('Error loading courses', error);
    }
  }
  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course,
    );
    this.#courses.set(newCourses);
  }
  async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter((course) => course.id !== courseId);
      this.#courses.set(newCourses);
    } catch (error) {
      alert('Error deleting courses!');
      console.error('Error deleting courses', error);
    }
  }
  async onAddCourse() {
    const createdCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create New Course',

    });
    if (!createdCourse) {
      return;
    }
    const newCourses = [...this.#courses(), createdCourse].sort(
      sortCoursesBySeqNo,
    );
    this.#courses.set(newCourses);
  }
  injector = inject(Injector);
  //courses$ = from(this.coursesService.loadAllCourses());
  // onToObservableExample() {
  //   const numbers = signal(0);
  //   numbers.set(1);
  //   numbers.set(2);
  //   numbers.set(3);
  //   const numbers$ = toObservable(numbers, { injector: this.injector });
  //   numbers.set(4);
  //   numbers$.subscribe((value) => {
  //     console.log('toObservable value:', value);
  //   });
  //   numbers.set(5);
  // }
  // onToSignalExample() {
  //   try {
  //     const courses$ = from(this.coursesService.loadAllCourses())
  //       .pipe(catchError((error) => {
  //         console.error('Error caught in catchError', error);
  //         return throwError(() => error);
  //       }));
  //     const courses = toSignal(courses$, { injector: this.injector });
  //     //const numbers$ = interval(1000);
  //     //const numbers = toSignal(numbers$, { injector: this.injector });
  //     effect(() => {
  //       console.log('Courses from toSignal:', courses());
  //     }, { injector: this.injector });
  //   }
  //   catch (error) {
  //     console.error('Error in catch block', error);
  //   }
  // }
}
