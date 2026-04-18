import { Component, effect, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Course } from '../models/course.model';
import { EditCourseDialogData } from './edit-course-dialog.data.model';
import { CoursesService } from '../services/courses.service';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CourseCategoryComboboxComponent } from '../course-category-combobox/course-category-combobox.component';
import { CourseCategory } from '../models/course-category.model';
import { firstValueFrom } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { CdkObserveContent } from '@angular/cdk/observers';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent,
    CdkObserveContent,
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss',
})
export class EditCourseDialogComponent {
  dialogRef = inject(MatDialogRef);
  courseData: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  coursesService = inject(CoursesService);
  category = signal<CourseCategory>('BEGINNER');

  form = this.fb.group({
    title: [''],
    longDiscription: [''],
    iconUrl: [''],
  });

  constructor() {
    this.form.patchValue({
      title: this.courseData?.course?.title,
      longDiscription: this.courseData?.course?.longDescription,
      iconUrl: this.courseData?.course?.iconUrl,
    });
    this.category.set(this.courseData?.course?.category ?? 'BEGINNER');
    effect(() => {
      console.log('Category changed to', this.category());
    })
  }
  onClose() {
    this.dialogRef.close();
  }

  async onSave() {
    const courseProps = this.form.value as Partial<Course>;
    courseProps.category = this.category();
    if (this.courseData?.mode === 'update') {
      await this.updateCourse(this.courseData.course!.id, courseProps);
    } else if (this.courseData?.mode === 'create') {
      await this.createCourse(courseProps);
    }
  }

  async updateCourse(courseId: string, chnages: Partial<Course>) {
    try {
      const updatedCourse = await this.coursesService.updateCourse(
        courseId,
        chnages,
      );
      this.dialogRef.close(updatedCourse);
    } catch (error) {
      alert('Error updating course!');
      console.error('Error updating course', error);
    }
  }

  async createCourse(course: Partial<Course>) {
    try {
      const createdCourse = await this.coursesService.createCourse(course);
      this.dialogRef.close(createdCourse);
    } catch (error) {
      alert('Error creating course!');
      console.error('Error creating course', error);
    }
  }
}

export async function openEditCourseDialog(
  dialog: MatDialog,
  data: EditCourseDialogData,
) {
  const config: MatDialogConfig = {
    width: '400px',
    data: data,
    autoFocus: true,
    disableClose: true,
  };
  const close$ = dialog.open(EditCourseDialogComponent, config).afterClosed();
  return firstValueFrom(close$);
}
