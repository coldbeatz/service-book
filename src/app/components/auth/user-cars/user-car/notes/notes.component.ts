import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { UserCar } from "../../../../../models/user-car.model";
import { CarNote } from "../../../../../models/car-note.model";
import { DataView } from "primeng/dataview";
import { UserCarNotePreviewComponent } from "./note/preview/user-car-note-preview.component";
import { Button } from "primeng/button";
import { InputGroup } from "primeng/inputgroup";
import { InputGroupAddon } from "primeng/inputgroupaddon";
import { InputText } from "primeng/inputtext";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Tooltip } from "primeng/tooltip";

@Component({
	selector: 'notes-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'notes.component.html',
	styleUrls: ['notes.component.scss'],
	imports: [
		RouterLink,
		CommonModule,
		TranslateModule,
		DataView,
		UserCarNotePreviewComponent,
		Button,
		InputGroup,
		InputGroupAddon,
		InputText,
		ReactiveFormsModule,
		Tooltip,
		FormsModule
	],
	standalone: true
})
export class NotesComponent implements OnInit {

	userCar!: UserCar;

	searchTerm: string = '';

	constructor(private route: ActivatedRoute) {

	}

	get notes(): CarNote[] {
		return this.userCar.notes || [];
	}

	ngOnInit(): void {
		this.route.parent?.data.subscribe(data => {
			this.userCar = data['userCar'];
		});
	}

	get filteredNotes(): CarNote[] {
		const term = this.searchTerm.toLowerCase();

		return this.notes.filter(note =>
			note.shortDescription.toLowerCase().includes(term) ||
			note.content.toLowerCase().includes(term)
		);
	}

	clearSearchInput() {
		this.searchTerm = '';
	}
}
