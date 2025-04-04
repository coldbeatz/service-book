import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Brand } from "../../../models/brand.model";
import { NavigationService } from "../../../services/navigation.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Car } from "../../../models/car.model";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { CarTransmissionType } from "../../../models/car-transmission-type.model";
import { BrandService } from "../../../services/api/brand.service";
import { CarService } from "../../../services/api/car.service";
import { LeftPanelComponent } from "../../shared/left-panel/left-panel.component";
import { ConfirmationService, MenuItem, PrimeIcons } from "primeng/api";
import { BootstrapButtonComponent } from "../../shared/button/bootstrap-button.component";
import { MultiSelect } from "primeng/multiselect";
import { CarTransmissionService, TransmissionOption } from "../../../services/car-transmission.service";
import { InputText } from "primeng/inputtext";
import { InputGroupAddon } from "primeng/inputgroupaddon";
import { Button } from "primeng/button";
import { InputGroup } from "primeng/inputgroup";
import { Tooltip } from "primeng/tooltip";
import { ConfirmDialog } from "primeng/confirmdialog";
import { AlertComponent } from "../../shared/alert/alert.component";
import { LanguageLinkPipe } from "../../../pipes/language-link.pipe";
import { MainComponent } from "../../shared/main/main.component";

enum CarsResponseType {
	CAR_DELETE_HAS_DEPENDENCIES_ERROR,
	CAR_DELETE_SUCCESS
}

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
        Tooltip,
        ConfirmDialog,
        AlertComponent,
        LanguageLinkPipe
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

	protected readonly CarsResponseType = CarsResponseType;
	responseType?: CarsResponseType;

	constructor(private carService: CarService,
				private brandService: BrandService,
				private navigationService: NavigationService,
				private translateService: TranslateService,
				private route: ActivatedRoute,
				protected carTransmissionService: CarTransmissionService,
				private confirmationService: ConfirmationService) {

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
							this.navigationService.navigate(['cars', this.brand?.id, 'create']);
						}
					},
					...this.cars.map(car => ({
						label: car.model,
						id: `car_${car.id}`,
						icon: PrimeIcons.CAR,
						command: () => {
							this.navigationService.navigate(['cars', this.brand?.id, car.id]);
						}
					}))
				]
			}
		];
	}

	onDeleteCar(car: Car): void {
		this.confirmationService.confirm({
			accept: () => {
				this.carService.deleteCar(car).subscribe({
					next: () => {
						this.responseType = CarsResponseType.CAR_DELETE_SUCCESS;

						this.cars = this.cars.filter(c => c.id !== car.id);

						window.scroll({top: 0, left: 0, behavior: 'smooth'});
					},
					error: (e) => {
						if (e.error.error === 'entity_has_dependencies') {
							this.responseType = CarsResponseType.CAR_DELETE_HAS_DEPENDENCIES_ERROR;

							window.scroll({top: 0, left: 0, behavior: 'smooth'});
						}
					}
				});
			}
		});
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
