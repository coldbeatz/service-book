import { Component, Input, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CarNote } from "../../../../../../../models/car-note.model";
import { RouterLink } from "@angular/router";

@Component({
	selector: 'user-car-note-preview',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'user-car-note-preview.component.html',
	styleUrls: ['user-car-note-preview.component.scss'],
	imports: [
		CommonModule,
		TranslateModule,
		RouterLink
	],
	standalone: true
})
export class UserCarNotePreviewComponent {

	@Input() note!: CarNote;

	@Input() routerLink?: any[] | string;

	constructor(private translate: TranslateService) {

	}

	formattedText(text: string): string {
		return !text ? this.translate.instant('CAR_NOTE_PREVIEW_CONTENT_EMPTY') : text.replace(/&nbsp;/g, " ");
	}
}
