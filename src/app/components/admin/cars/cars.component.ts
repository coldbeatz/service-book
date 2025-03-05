import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Brand } from "../../../models/brand.model";
import { NavigationService } from "../../../services/navigation.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Car } from "../../../models/car.model";
import { MainComponent } from "../../internal/main/main.component";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { NgForOf } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { CarTransmissionType } from "../../../models/car-transmission-type.model";
import { BrandService } from "../../../services/api/brand.service";
import { CarService } from "../../../services/api/car.service";

@Component({
	selector: 'cars-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'cars.component.html',
	styleUrls: ['cars.component.scss'],
	imports: [
		RouterLink,
		MainComponent,
		BreadcrumbComponent,
		NgForOf,
		TranslateModule,
		FormsModule
	],
	standalone: true
})
export class CarsComponent implements OnInit {

	brand: Brand | null = null;
	cars: Car[] = [];

	currentYear: number;

	availableTransmissions: { value: CarTransmissionType; label: string } [] = [];

	selectedTransmissions: CarTransmissionType[] = [];

	/**
	 * Текст для пошуку
	 */
	searchTerm: string = '';

	constructor(private carService: CarService,
				private brandService: BrandService,
				private navigationService: NavigationService,
				private translateService: TranslateService,
				private route: ActivatedRoute) {

		this.currentYear = new Date().getFullYear();
	}

	private initAvailableTransmissions(): void {
		const enumKeys = Object.keys(CarTransmissionType)
			.filter(key => isNaN(Number(key)) && key !== "OTHER");

		const translationKeys = enumKeys.map(key => `TRANSMISSION_${key}`);

		this.translateService.get(translationKeys).subscribe((translations: { [key: string]: string }) => {
			this.availableTransmissions = enumKeys.map(key => ({
				value: CarTransmissionType[key as keyof typeof CarTransmissionType],
				label: translations[`TRANSMISSION_${key}`]
			}));
		});
	}

	ngOnInit(): void {
		const brandId = Number(this.route.snapshot.paramMap.get("brand"));

		this.brandService.getBrandById(brandId).subscribe({
			next: (brand) => {
				this.brand = brand;

				this.carService.getCarsByBrand(brand).subscribe({
					next: (cars) => {
						this.cars = cars;
					}
				});
			},
			error: (e) => {
				if (e.error.code == 'car_brand_not_found') {
					this.navigationService.navigate(['brands']);
				}
			}
		});

		this.initAvailableTransmissions();
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

	onClickTransmission(transmission: CarTransmissionType) {
		if (this.selectedTransmissions.includes(transmission)) {
			this.selectedTransmissions = this.selectedTransmissions.filter(t => t !== transmission);
		} else {
			this.selectedTransmissions.push(transmission);
		}
	}
}
