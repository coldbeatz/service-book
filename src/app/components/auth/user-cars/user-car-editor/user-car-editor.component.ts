import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "../../../internal/main/main.component";
import { BreadcrumbComponent } from "../../../internal/breadcrumb/breadcrumb.component";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { UserCar } from "../../../../models/user-car.model";
import { UserCarService } from "../../../../services/api/user-car.service";
import { ActivatedRoute } from "@angular/router";
import { UserCarEditorSettingsComponent } from "./settings/user-car-editor-settings.component";
import { UserCarNoteComponent } from "./note/user-car-note.component";
import { CarNote } from "../../../../models/car-note.model";
import { LeftPanelComponent } from "../../../shared/left-panel/left-panel.component";
import { MenuItem, PrimeIcons } from "primeng/api";

enum CarEditorWindowType {
	SETTINGS,
	NOTE,
	REGULATION_MAINTENANCE
}

@Component({
	selector: 'user-car-editor-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'user-car-editor.component.html',
	styleUrls: ['user-car-editor.component.scss'],
	imports: [
		CommonModule,
		MainComponent,
		BreadcrumbComponent,
		TranslateModule,
		FormsModule,
		UserCarEditorSettingsComponent,
		UserCarNoteComponent,
		LeftPanelComponent
	],
	standalone: true
})
export class UserCarEditorComponent implements OnInit {

	protected userCar: UserCar = new UserCar();

	notes: CarNote[] = [];
	selectedNote: CarNote = new CarNote();

	windowType: CarEditorWindowType = CarEditorWindowType.SETTINGS;

	CarEditorWindowType = CarEditorWindowType;

	constructor(private userCarService: UserCarService,
				private route: ActivatedRoute) {

	}

	get menuItems(): MenuItem[] {
		return [
			{
				label: 'Car settings',
				id: 'settings',
				icon: PrimeIcons.COG,
				command: () => this.openCarSettings()
			},
			{
				label: 'Notes',
				icon: 'pi pi-fw pi-cog',
				expanded: true,
				items: [
					{
						label: 'Create note',
						id: 'create_note',
						icon: PrimeIcons.PLUS,
						command: () => this.createNote()
					},
					...this.notes.map(note => ({
						label: note.shortDescription,
						id: `note_${note.id}`,
						icon: PrimeIcons.EYE,
						command: () => this.openNote(note)
					}))
				]
			}
		];
	}

	ngOnInit(): void {
		this.loadUserCar();
	}

	private loadUserCar(): void {
		let userCarId = Number(this.route.snapshot.paramMap.get('userCarId'));

		if (userCarId) {
			this.userCarService.getUserCarById(userCarId).subscribe({
				next: (userCar) => {
					this.userCar = userCar;

					this.userCarService.getNotes(userCar).subscribe({
						next: (notes: CarNote[]) => {
							this.notes = notes;
						}
					})
				}
			})
		}
	}

	onNoteSaved(note: CarNote): void {
		const index = this.notes.findIndex(n => n.id === note.id);
		if (index >= 0) {
			this.notes[index] = note;
		} else {
			this.notes.push(note);
		}
	}

	onNoteDeleted(note: CarNote): void {
		const index = this.notes.findIndex(n => n.id === note.id);
		if (index >= 0) {
			this.notes.splice(index, 1);
		}
	}

	createNote() {
		this.selectedNote = new CarNote();
		this.selectedNote.userCar = this.userCar;

		this.windowType = CarEditorWindowType.NOTE;
	}

	openNote(note: CarNote) {
		this.windowType = CarEditorWindowType.NOTE;
		this.selectedNote = { ...note }; // щоб не редагувати оригінал напряму
	}

	openCarSettings() {
		this.windowType = CarEditorWindowType.SETTINGS;
	}
}
