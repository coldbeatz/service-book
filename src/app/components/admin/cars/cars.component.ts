import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Brand } from "../../../models/brand.model";
import { ApiRequestsService } from "../../../services/api-requests.service";
import { NavigationService } from "../../../services/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { Car } from "../../../models/car.model";

@Component({
	selector: 'cars-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'cars.component.html',
	styleUrls: ['cars.component.scss'],
})
export class CarsComponent implements OnInit {

	brand: Brand | null = null;
	cars: Car[] = [];

	currentYear: number;

	availableTransmissions: string[] = [];
	selectedTransmissions: string[] = [];

	/**
	 * Текст для пошуку
	 */
	searchTerm: string = '';

	protected readonly environment = environment;

	constructor(private apiRequestsService: ApiRequestsService,
				private navigationService: NavigationService,
				private route: ActivatedRoute) {

		this.currentYear = new Date().getFullYear();
	}

	ngOnInit(): void {
		let id = this.route.snapshot.paramMap.get('id');

		this.apiRequestsService.getBrandById(Number(id)).subscribe({
			next: (brand) => {
				this.brand = brand;

				this.apiRequestsService.getCarsByBrand(brand).subscribe({
					next: (cars) => {
						this.cars = cars;
						console.log(cars);
					}
				});
			},
			error: (e) => {
				if (e.error.code == 'car_brand_not_found') {
					this.navigationService.navigate('brands');
				}
			}
		});

		this.apiRequestsService.getTransmissions().subscribe({
			next: (transmissions) => {
				this.availableTransmissions = transmissions;

				//const formGroupConfig: { [key: string]: boolean } = {};
				//transmissions.forEach((transmission) => {
				//	formGroupConfig[transmission] = false;
				//});

				//this.form.setControl('transmissions', this.fb.group(formGroupConfig));

				//this.initCar();
			}
		});
	}

	get filteredCars() {
		const searchTerm = this.searchTerm.trim().toLowerCase();

		if (!searchTerm && this.selectedTransmissions.length === 0) {
			return this.cars;
		}

		return this.cars.filter(car => {
			const matchesSearchTerm = searchTerm ? car.model.toLowerCase().includes(searchTerm) : true;

			const matchesTransmission = this.selectedTransmissions.length > 0
				? car.transmissions.some(transmission => this.selectedTransmissions.includes(transmission)) : true;

			return matchesSearchTerm && matchesTransmission;
		});
	}

	clearSearchInput(): void {
		this.searchTerm = '';
	}

	onClickTransmission(transmission: string) {
		if (this.selectedTransmissions.includes(transmission)) {
			this.selectedTransmissions = this.selectedTransmissions.filter(t => t !== transmission);
		} else {
			this.selectedTransmissions.push(transmission);
		}
	}
}
