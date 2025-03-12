import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Brand } from "../../../models/brand.model";
import { NavigationService } from "../../../services/navigation.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Car } from "../../../models/car.model";
import { MainComponent } from "../../internal/main/main.component";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { CarTransmissionType } from "../../../models/car-transmission-type.model";
import { BrandService } from "../../../services/api/brand.service";
import { CarService } from "../../../services/api/car.service";
import { LeftPanelComponent } from "../../shared/left-panel/left-panel.component";
import { MenuItem, PrimeIcons } from "primeng/api";
import { BootstrapButtonComponent } from "../../shared/button/bootstrap-button.component";
import { MultiSelect } from "primeng/multiselect";
import { CarTransmissionService, TransmissionOption } from "../../../services/car-transmission.service";
import { InputText } from "primeng/inputtext";
import { InputGroupAddon } from "primeng/inputgroupaddon";
import { Button } from "primeng/button";
import { InputGroup } from "primeng/inputgroup";
import { Tooltip } from "primeng/tooltip";

@Component({
	selector: 'cars-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'cars.component.html',
	styleUrls: ['cars.component.scss'],
	imports: [
		RouterLink,
		MainComponent,
		BreadcrumbComponent,
		CommonModule,
		TranslateModule,
		FormsModule,
		LeftPanelComponent,
		BootstrapButtonComponent,
		MultiSelect,
		InputText,
		InputGroupAddon,
		Button,
		InputGroup,
		Tooltip
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

	transmissionOptions: TransmissionOption[] = [];

	constructor(private carService: CarService,
				private brandService: BrandService,
				private navigationService: NavigationService,
				private translateService: TranslateService,
				private route: ActivatedRoute,
				protected carTransmissionService: CarTransmissionService) {

		this.currentYear = new Date().getFullYear();

		this.carTransmissionService.transmissionOptions$.subscribe(() => {
			this.transmissionOptions = this.carTransmissionService.getOptions();
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
						command: () => {
							this.navigationService.navigate(['/cars', this.brand?.id, 'create']);
						}
					},
					...this.cars.map(car => ({
						label: car.model,
						id: `car_${car.id}`,
						icon: PrimeIcons.CAR,
						command: () => {
							this.navigationService.navigate(['/cars', this.brand?.id, car.id]);
						}
					}))
				]
			}
		];
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
}
