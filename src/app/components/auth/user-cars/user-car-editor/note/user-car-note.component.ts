import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { Editor } from "primeng/editor";
import { FormsModule } from "@angular/forms";
import { CarNote } from "../../../../../models/car-note.model";
import { FormInputComponent } from "../../../../shared/form/form-input/form-input.component";
import { BootstrapButtonComponent } from "../../../../shared/button/bootstrap-button.component";
import { UserCarNoteService } from "../../../../../services/api/user-car-note.service";
import { UserCar } from "../../../../../models/user-car.model";
import { AlertComponent } from "../../../../internal/alert/alert.component";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";

enum NoteWindowType {
	PREVIEW,
	EDIT
}

@Component({
	selector: 'user-car-note-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'user-car-note.component.html',
	styleUrls: ['user-car-note.component.scss'],
	imports: [
		CommonModule,
		TranslateModule,
		Editor,
		FormsModule,
		FormInputComponent,
		BootstrapButtonComponent,
		AlertComponent,
		ConfirmDialog
	],
	standalone: true
})
export class UserCarNoteComponent implements OnInit, OnChanges {

	@Input() userCar!: UserCar;

	@Input() note: CarNote = new CarNote();

	@Output() saved = new EventEmitter<CarNote>();
	@Output() deleted = new EventEmitter<CarNote>();

	deletedSuccess: boolean = false;
	noteUpdated: boolean = false;

	protected readonly NoteWindowType = NoteWindowType;

	protected windowType: NoteWindowType = NoteWindowType.PREVIEW;


	constructor(private userCarNoteService: UserCarNoteService,
				private confirmationService: ConfirmationService) {

	}

	formattedText(text: string): string {
		return !text ? 'Content is empty...' : text.replace(/&nbsp;/g, " ");
	}

	ngOnInit(): void {

	}

	ngOnChanges(changes: SimpleChanges): void {
		this.noteUpdated = false;

		if (changes['userCar'] && changes['userCar'].currentValue) {
			if (this.note.userCar == null) {
				setTimeout(() => {
					this.note.userCar = this.userCar;
				});
			}
		}

		if (changes['note'] && changes['note'].currentValue) {
			if (!this.note.id) {
				this.windowType = NoteWindowType.EDIT;
			}
		}
	}

	onClickSaveButton(): void {
		this.noteUpdated = false;
		this.deletedSuccess = false;

		this.userCarNoteService.saveOrUpdateNote(this.note).subscribe({
			next: (note) => {
				this.note = note;
				this.saved.emit(note);

				this.noteUpdated = true;

				window.scrollTo({ top: 0, behavior: 'smooth' });
				this.previewButtonClick();
			}
		})
	}

	editButtonClick() {
		this.windowType = NoteWindowType.EDIT;
	}

	previewButtonClick() {
		this.windowType = NoteWindowType.PREVIEW;
	}

	deleteButtonClick() {
		this.deletedSuccess = false;

		this.confirmationService.confirm({
			accept: () => {
				this.userCarNoteService.deleteNote(this.note).subscribe({
					next: () => {
						this.deletedSuccess = true;

						this.deleted.emit(this.note);

						this.note = new CarNote();
						this.windowType = NoteWindowType.EDIT;
					}
				});
			}
		});
	}
}
