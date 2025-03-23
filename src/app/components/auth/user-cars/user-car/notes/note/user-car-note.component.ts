import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { Editor } from "primeng/editor";
import { FormsModule } from "@angular/forms";
import { CarNote } from "../../../../../../models/car-note.model";
import { FormInputComponent } from "../../../../../shared/form/form-input/form-input.component";
import { BootstrapButtonComponent } from "../../../../../shared/button/bootstrap-button.component";
import { UserCarNoteService } from "../../../../../../services/api/user-car-note.service";
import { UserCar } from "../../../../../../models/user-car.model";
import { AlertComponent } from "../../../../../internal/alert/alert.component";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { EMPTY, switchMap, tap } from "rxjs";
import { catchError } from "rxjs/operators";
import { NavigationService } from "../../../../../../services/navigation.service";
import { UserCarNotePreviewComponent } from "./preview/user-car-note-preview.component";

enum NoteWindowType {
	PREVIEW,
	EDIT
}

enum NoteResponse {
	DELETED_SUCCESS,
	UPDATED_SUCCESS
}

@Component({
	selector: 'user-car-notes-root',
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
		ConfirmDialog,
		UserCarNotePreviewComponent
	],
	standalone: true
})
export class UserCarNoteComponent implements OnInit {

	userCar!: UserCar;

	note: CarNote = new CarNote();

	@Output() saved = new EventEmitter<CarNote>();
	@Output() deleted = new EventEmitter<CarNote>();

	protected readonly NoteResponse = NoteResponse;
	response: NoteResponse | null = null;

	protected readonly NoteWindowType = NoteWindowType;

	protected windowType: NoteWindowType = NoteWindowType.PREVIEW;


	constructor(private userCarNoteService: UserCarNoteService,
				private confirmationService: ConfirmationService,
				private route: ActivatedRoute,
				private navigationService: NavigationService) {

	}

	ngOnInit(): void {
		this.route.parent?.data.pipe(
			tap(data => {
				this.userCar = data['userCar'];
				this.note.userCar = this.userCar;
			}),
			switchMap(() => this.route.paramMap),
			switchMap(params => {
				const id = Number(params.get('noteId'));

				if (!isNaN(id) && this.userCar?.id) {
					return this.userCarNoteService.getNoteById(id, this.userCar.id).pipe(
						tap(note => {
							note.userCar = this.userCar;
							this.note = note;
						})
					);
				} else {
					this.note = new CarNote();
					this.note.userCar = this.userCar;
					this.windowType = NoteWindowType.EDIT;

					// Повертаємо порожній observable, якщо немає даних
					return EMPTY;
				}
			}),
			catchError(err => {
				console.error('Error loading notes', err);
				return EMPTY;
			})
		).subscribe();
	}

	onClickSaveButton(): void {
		this.response = null;

		this.userCarNoteService.saveOrUpdateNote(this.note).subscribe({
			next: (note) => {
				if (!this.note.id && note.id) {
					this.navigationService.updateUrlIfChanged([`/user-cars/${this.userCar.id}/notes/${note.id}`]);
				}

				this.note = note;
				this.saved.emit(note);

				this.response = NoteResponse.UPDATED_SUCCESS;

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
		this.response = null;

		this.confirmationService.confirm({
			accept: () => {
				this.userCarNoteService.deleteNote(this.note).subscribe({
					next: () => {
						this.response = NoteResponse.DELETED_SUCCESS;

						this.deleted.emit(this.note);

						this.note = new CarNote();
						this.windowType = NoteWindowType.EDIT;
					}
				});
			}
		});
	}
}
