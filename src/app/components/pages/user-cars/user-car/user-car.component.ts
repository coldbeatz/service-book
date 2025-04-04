import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbComponent } from "../../../shared/breadcrumb/breadcrumb.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { UserCar } from "../../../../models/user-car.model";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { CarNote } from "../../../../models/car-note.model";
import { LeftPanelComponent } from "../../../shared/left-panel/left-panel.component";
import { MenuItem, PrimeIcons } from "primeng/api";
import { UserCarNoteComponent } from "./notes/note/user-car-note.component";
import { UserCarNoteService } from "../../../../services/api/user-car-note.service";
import { MainComponent } from "../../../shared/main/main.component";

@Component({
	selector: 'user-car-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'user-car.component.html',
	styleUrls: ['user-car.component.scss'],
	imports: [
		CommonModule,
		MainComponent,
		BreadcrumbComponent,
		TranslateModule,
		FormsModule,
		LeftPanelComponent,
		RouterOutlet
	],
	standalone: true
})
export class UserCarComponent implements OnInit {

	protected userCar: UserCar = new UserCar();

	notes: CarNote[] = [];

	constructor(private userCarNoteService: UserCarNoteService,
				private route: ActivatedRoute,
				private translateService: TranslateService) {

	}

	get menuItems(): MenuItem[] {
		const items: MenuItem[] = [
			{
				label: this.translateService.instant("CAR_SETTINGS"),
				id: 'profile',
				icon: PrimeIcons.COG,
				routerLink: ['user-cars', this.userCar.id ? this.userCar.id : 'create' ]
			}
		];

		if (this.userCar.id) {
			items.push({
				label: this.translateService.instant("REGULATIONS_MAINTENANCE"),
				id: "maintenance",
				icon: PrimeIcons.WRENCH,
				routerLink: ['user-cars', this.userCar.id, 'maintenance'],
			});

			items.push({
				label: this.translateService.instant("NOTES"),
				icon: 'pi pi-fw pi-cog',
				expanded: true,
				items: [
					{
						label: this.translateService.instant("ENGINES_ALL_BUTTON"),
						id: 'all_engines',
						icon: PrimeIcons.EYE,
						routerLink: ['user-cars', this.userCar.id, 'notes'],
					},
					{
						label: this.translateService.instant("CREATE_NOTE"),
						id: 'create_note',
						icon: PrimeIcons.PLUS,
						routerLink: ['user-cars', this.userCar.id, 'notes', 'new']
					},
					...this.notes.map(note => ({
						label: note.shortDescription,
						id: `note_${note.id}`,
						icon: PrimeIcons.EYE,
						routerLink: ['user-cars', this.userCar.id, 'notes', note.id]
					}))
				]
			});
		}

		return items;
	}

	ngOnInit(): void {
		this.route.data.subscribe(data => {
			this.userCar = data['userCar'];

			if (this.userCar.id) {
				this.userCarNoteService.getNotes(this.userCar).subscribe({
					next: (notes: CarNote[]) => {
						this.userCar.notes = notes;
						this.notes = notes;
					}
				});
			}
		});
	}

	onChildActivate(component: any) {
		if (component instanceof UserCarNoteComponent) {
			component.saved.subscribe((note: CarNote) => this.onNoteSaved(note));
			component.deleted.subscribe((note: CarNote) => this.onNoteDeleted(note));
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
}
