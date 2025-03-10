import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NavigationService } from "../../../../services/navigation.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Car } from "../../../../models/car.model";
import { BreadcrumbComponent } from "../../../internal/breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { MainComponent } from "../../../internal/main/main.component";
import { TranslateModule } from "@ngx-translate/core";
import { BrandService } from "../../../../services/api/brand.service";
import { CarService } from "../../../../services/api/car.service";
import { LeftPanelComponent } from "../../../shared/left-panel/left-panel.component";
import { MenuItem, PrimeIcons } from "primeng/api";
import { CarMaintenanceComponent } from "./maintenance/car-maintenance.component";
import { CarEditorComponent } from "./editor/car-editor.component";

enum CarWindowType {
	SETTINGS = "settings",
	REGULATION_MAINTENANCE = "maintenance",
	ENGINES = "engines",
}

@Component({
	selector: 'create-car-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'create-car.component.html',
	styleUrls: ['create-car.component.scss'],
	imports: [
		BreadcrumbComponent,
		ReactiveFormsModule,
		CommonModule,
		MainComponent,
		TranslateModule,
		LeftPanelComponent,
		CarMaintenanceComponent,
		CarEditorComponent
	],
	standalone: true
})
export class CreateCarComponent implements OnInit {

	car: Car = new Car();

	protected readonly CarWindowType = CarWindowType;

	windowType: CarWindowType = CarWindowType.SETTINGS;

	constructor(private carService: CarService,
				private brandService: BrandService,
				private navigationService: NavigationService,
				private route: ActivatedRoute,
				private router: Router) {
	}

	openCarSettings() {
		if (this.car && this.car.brand) {
			this.navigationService.navigate([`/cars/${this.car.brand.id}/${this.car.id}`]);
		}

		this.windowType = CarWindowType.SETTINGS;
	}

	openCarMaintenance() {
		if (this.car && this.car.brand) {
			this.navigationService.navigate([`/cars/${this.car.brand.id}/${this.car.id}/maintenance`]);
		}

		this.windowType = CarWindowType.REGULATION_MAINTENANCE;
	}

	openCarEngines() {
		if (this.car && this.car.brand) {
			this.navigationService.navigate([`/cars/${this.car.brand.id}/${this.car.id}/engines`]);
		}

		this.windowType = CarWindowType.ENGINES;
	}

	get menuItems(): MenuItem[] {
		return [
			{
				label: 'Car settings',
				id: CarWindowType.SETTINGS,
				icon: PrimeIcons.COG,
				command: () => this.openCarSettings()
			},
			...(this.car.id? [
				{
					label: 'Regulations maintenance',
					id: CarWindowType.REGULATION_MAINTENANCE,
					icon: PrimeIcons.WRENCH,
					command: () => this.openCarMaintenance()
				},
				{
					label: 'Engines',
					id: CarWindowType.ENGINES,
					icon: PrimeIcons.CAR,
					command: () => this.openCarEngines()
				}
			] : [])
		];
	}

	ngOnInit(): void {
		const currentUrl = this.router.url;

		if (currentUrl.includes('/maintenance')) {
			this.openCarMaintenance();
		} else {
			this.openCarSettings();
		}

		this.initCar();
	}

	initCar() {
		let brandId = Number(this.route.snapshot.paramMap.get('brand'));

		this.brandService.getBrandById(brandId).subscribe({
			next: (brand) => {
				let carId = Number(this.route.snapshot.paramMap.get('carId'));

				this.carService.getCarById(carId).subscribe({
					next: (car) => {
						car.brand = brand;

						this.car = car;
					},
					error: () => {
						this.navigationService.navigate([`/cars/${brand.id}/create`]);
					}
				});
			},
			error: (e) => {
				if (e.error.code == 'car_brand_not_found') {
					this.navigationService.navigate(['brands']);
				}
			}
		});
	}
}
