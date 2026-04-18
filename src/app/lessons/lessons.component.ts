import { Component, ElementRef, inject, signal, viewChild, model } from "@angular/core";
import { LessonsService } from "../services/lessons.service";
import { Lesson } from "../models/lesson.model";
import { LessonDetailComponent } from "./lesson-detail/lesson-detail.component";

@Component({
    selector: 'lessons',
    imports: [
        LessonDetailComponent
    ],
    templateUrl: './lessons.component.html',
    styleUrl: './lessons.component.scss'
})
export class LessonsComponent {

    mode = signal<'master' | 'details'>('master');
    lessons = signal<Lesson[]>([])
    selectedLesson = signal<Lesson | null>(null);
    lessonsService = inject(LessonsService);
    searchInput = viewChild.required<ElementRef>('search');
    async onSearch() {
        const query = this.searchInput()?.nativeElement.value;
        const lessons = await this.lessonsService.loadLessons({ query });
        this.lessons.set(lessons);
    }

    onLessonSelected(Lesson: Lesson) {
        this.mode.set('details');
        this.selectedLesson.set(Lesson);
    }

    onLessonUpdated(Lesson: Lesson) {
        this.lessons.update(lessons =>
            lessons.map(les => les.id === Lesson.id ? Lesson : les)
        );
        this.mode.set('master');
    }

    onCancel() {
        this.mode.set('master');
    }
}
