import { Component, inject, input, output } from '@angular/core';
import { Lesson } from "../../models/lesson.model";
import { ReactiveFormsModule } from "@angular/forms";
import { LessonsService } from "../../services/lessons.service";
import { MessagesService } from "../../messages/messages.service";

@Component({
    selector: 'lesson-detail',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './lesson-detail.component.html',
    styleUrl: './lesson-detail.component.scss'
})
export class LessonDetailComponent {

    lesson = input.required<Lesson | null>();
    cancel = output();
    lessonUpdated = output<Lesson>()
    lessonService = inject(LessonsService);
    messagesService = inject(MessagesService);
    onCancel() {
        this.cancel.emit();
    }
    async onSave(description: string) {
        try {
            const lesson = this.lesson();
            const updatedLesson = await this.lessonService.updateLesson(lesson!.id, {
                description: description
            });
            this.lessonUpdated.emit(updatedLesson);
        }
        catch (error) {
            this.messagesService.showMessage('Failed to update lesson', 'error');
        }
    }
}
