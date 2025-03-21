import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "../../internal/main/main.component";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { UserCarService } from "../../../services/api/user-car.service";
import { UserCar } from "../../../models/user-car.model";
import { DataView } from "primeng/dataview";
import { Tag } from "primeng/tag";
import { CarTransmissionType } from "../../../models/car-transmission-type.model";
import { FuelType } from "../../../models/fuel-type.model";
import { ConfirmationService, MenuItem, PrimeIcons, PrimeTemplate } from "primeng/api";
import { ConfirmDialog } from "primeng/confirmdialog";
import { AlertComponent } from "../../internal/alert/alert.component";
import { LeftPanelComponent } from "../../shared/left-panel/left-panel.component";
import { BootstrapButtonComponent } from "../../shared/button/bootstrap-button.component";
import { Button } from "primeng/button";
import { InputGroup } from "primeng/inputgroup";
import { InputGroupAddon } from "primeng/inputgroupaddon";
import { InputText } from "primeng/inputtext";
import { Tooltip } from "primeng/tooltip";

@Component({
	selector: 'user-cars-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'user-cars.component.html',
	styleUrls: ['user-cars.component.scss'],
	imports: [
		CommonModule,
		MainComponent,
		BreadcrumbComponent,
		TranslateModule,
		FormsModule,
		RouterLink,
		DataView,
		Tag,
		PrimeTemplate,
		ConfirmDialog,
		AlertComponent,
		LeftPanelComponent,
		BootstrapButtonComponent,
		Button,
		InputGroup,
		InputGroupAddon,
		InputText,
		Tooltip
	],
	standalone: true
})
export class UserCarsComponent implements OnInit {

	userCars: UserCar[] = [];

	deletedSuccess: boolean = false;

	/**
	 * Текст для пошуку
	 */
	searchTerm: string = '';

	protected readonly CarTransmissionType = CarTransmissionType;
	protected readonly FuelType = FuelType;

	constructor(private userCarService: UserCarService,
				private confirmationService: ConfirmationService,
				private translateService: TranslateService) {

	}

	ngOnInit(): void {
		this.userCarService.getUserCars().subscribe({
			next: userCars => {
				this.userCars = userCars;
			}
		})
	}

	get filteredUserCars(): UserCar[] {
		return this.userCars.filter(userCar => {
			const search = this.searchTerm.toLowerCase();

			return userCar.licensePlate.toLowerCase().includes(search) ||
				   userCar.vinCode.toLowerCase().includes(search) ||
				   userCar.car?.model.toLowerCase().includes(search) ||
				   userCar.car?.brand?.brand.toLowerCase().includes(search);
		});
	}

	deleteUserCar(userCarToDelete: UserCar): void {
		this.deletedSuccess = false;

		this.confirmationService.confirm({
			accept: () => {
				this.userCarService.deleteUserCar(userCarToDelete).subscribe({
					next: () => {
						this.deletedSuccess = true;

						if (this.userCars) {
							this.userCars = this.userCars.filter(car => car.id !== userCarToDelete.id);
						}
					}
				});
			}
		});
	}

	get menuItems(): MenuItem[] {
		return [
			{
				label: this.translateService.instant("CARS_LIST"),
				id: 'cars',
				expanded: true,
				items: [
					{
						label: this.translateService.instant("CARS_ADD_CAR_BUTTON"),
						id: 'create_car',
						icon: PrimeIcons.PLUS,
						routerLink: '/user-cars/create'
					},
					...this.filteredUserCars.map(userCar => ({
						label: userCar.licensePlate,
						id: `car_${userCar.id}`,
						icon: PrimeIcons.CAR,
						routerLink: ['/user-cars/', userCar.id]
					}))
				]
			}
		];
	}

	setDefaultImage($event: ErrorEvent) {
		const imgElement = $event.target as HTMLImageElement;
		imgElement.src = 'assets/images/no-picture.jpg';
	}

	clearSearchInput() {
		this.searchTerm = '';
	}
}
