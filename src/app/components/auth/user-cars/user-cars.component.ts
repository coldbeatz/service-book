import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "../../internal/main/main.component";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { UserCarService } from "../../../services/api/user-car.service";
import { UserCar } from "../../../models/user-car.model";
import { DataView } from "primeng/dataview";
import { Tag } from "primeng/tag";
import { CarTransmissionType } from "../../../models/car-transmission-type.model";
import { FuelType } from "../../../models/fuel-type.model";
import { ConfirmationService, PrimeTemplate } from "primeng/api";
import { ConfirmDialog } from "primeng/confirmdialog";
import { AlertComponent } from "../../internal/alert/alert.component";

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
		AlertComponent
	],
	standalone: true
})
export class UserCarsComponent implements OnInit {

	userCars: UserCar[] = [];

	deletedSuccess: boolean = false;

	constructor(private userCarService: UserCarService,
				private confirmationService: ConfirmationService) {

	}

	ngOnInit(): void {
		this.userCarService.getUserCars().subscribe({
			next: userCars => {
				this.userCars = userCars;
				console.log(this.userCars);
			}
		})
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

	protected readonly CarTransmissionType = CarTransmissionType;
	protected readonly FuelType = FuelType;

	setDefaultImage($event: ErrorEvent) {
		const imgElement = $event.target as HTMLImageElement;
		imgElement.src = 'assets/images/no-picture.jpg';
	}
}
