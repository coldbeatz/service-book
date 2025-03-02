import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "../../../internal/main/main.component";
import { BreadcrumbComponent } from "../../../internal/breadcrumb/breadcrumb.component";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { UserCar } from "../../../../models/user-car.model";
import { BrandOption, BrandService } from "../../../../services/api/brand.service";
import { Brand } from "../../../../models/brand.model";
import { Select } from "primeng/select";
import { CarOption, CarService } from "../../../../services/api/car.service";
import { Car } from "../../../../models/car.model";
import { NumberFormInputComponent } from "../../../shared/form/number-form-input/number-form-input.component";
import { FormInputComponent } from "../../../shared/form/form-input/form-input.component";
import { CarTransmissionService, TransmissionOption } from "../../../../services/car-transmission.service";
import { FuelTypeService } from "../../../../services/fuel-type.service";
import { CustomFileUploadComponent } from "../../../shared/custom-file-upload/custom-file-upload.component";
import { UserCarService } from "../../../../services/api/user-car.service";
import { CarTransmissionType } from "../../../../models/car-transmission-type.model";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../../environments/environment";
import { AlertComponent } from "../../../internal/alert/alert.component";
import { NavigationService } from "../../../../services/navigation.service";

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
		Select,
		FormInputComponent,
		NumberFormInputComponent,
		CustomFileUploadComponent,
		AlertComponent
	],
	standalone: true
})
export class UserCarEditorComponent implements OnInit {

	protected userCar: UserCar = new UserCar();

	brands: Brand[] = [];
	carsByBrand: Car[] = [];

	brandsOptions: BrandOption[] = [];
	carsOptions: CarOption[] = [];

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	transmissionOptions: TransmissionOption[] = [];

	selectedBrand: Brand | null = null;

	userCarUpdated: boolean = false;

	@ViewChild('vehicleYearInput', { static: false })
	vehicleYearInputComponent!: NumberFormInputComponent;

	constructor(private brandService: BrandService,
				private carService: CarService,
				private userCarService: UserCarService,
				protected carTransmissionService: CarTransmissionService,
				protected fuelTypeService: FuelTypeService,
				private navigationService: NavigationService,
				private route: ActivatedRoute) {

	}

	ngOnInit(): void {
		this.brandService.getBrands().subscribe({
			next: (response) => {
				this.brands = response;

				this.brandsOptions = this.brands.map((brand: Brand) => ({
					value: brand,
					label: brand.brand
				}));
			},
			error: (e) => {
				console.log(e);
			}
		});

		this.carTransmissionService.transmissionOptions$.subscribe(() => {
			this.updateTransmissionOptions();
		});

		this.loadUserCar();
	}

	private loadUserCar(): void {
		let userCarId = Number(this.route.snapshot.paramMap.get('userCarId'));

		if (userCarId) {
			this.userCarService.getUserCarById(userCarId).subscribe({
				next: (userCar) => {
					this.initUserCar(userCar);
				}
			})
		}
	}

	private initUserCar(userCar: UserCar): void {
		this.userCar = userCar;

		this.selectedBrand = userCar.car?.brand ?? null;

		if (this.selectedBrand) {
			this.onBrandSelected(this.selectedBrand);
		}

		this.imagePreview = environment.resourcesUrl + "/" + userCar.imageResource?.url;
	}

	updateTransmissionOptions(transmissions?: CarTransmissionType[]) {
		this.transmissionOptions = this.carTransmissionService.getOptions(transmissions);
	}

	private updateVehicleYear() {
		const car = this.userCar.car;

		const minYear = this.vehicleYearInputComponent.min = car?.startYear ?? 1900;
		const maxYear = this.vehicleYearInputComponent.max = car?.endYear ?? this.maxYear;

		if (this.userCar.vehicleYear && (this.userCar.vehicleYear < minYear || this.userCar.vehicleYear > maxYear)) {
			this.userCar.vehicleYear = null;
		}
	}

	buttonDisabled(): boolean {
		const userCar = this.userCar;

		return !userCar.car ||
			   !userCar.vinCode ||
			   !userCar.vehicleMileage ||
			   !userCar.vehicleYear ||
			   userCar.transmissionType == null ||
			   userCar.fuelType == null;
	}

	onFileSelected(file: File | null): void {
		this.selectedFile = file;

		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				this.imagePreview = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	onBrandSelected(brand: Brand) {
		const car = this.userCar.car;

		this.userCar.car = null;

		this.carsByBrand = [];
		this.carsOptions = [];

		this.updateTransmissionOptions();
		this.updateVehicleYear();

		this.carService.getCarsByBrand(brand).subscribe({
			next: (cars) => {
				this.carsByBrand = cars;

				this.carsOptions = this.carsByBrand.map((car: Car) => ({
					value: car,
					label: car.model
				}));

				if (car && car.brand?.id === brand.id) {
					this.userCar.car = this.carsByBrand.find(c => c.id === car?.id) || null;
				}
			}
		})
	}

	onCarSelected(car: Car) {
		this.updateTransmissionOptions(car.transmissions);
		this.updateVehicleYear();
	}

	protected get maxYear(): number {
		return new Date().getFullYear();
	}

	onSubmit() {
		this.userCarUpdated = false;

		this.userCarService.saveOrUpdateUserCar(this.userCar, this.selectedFile).subscribe({
			next: (userCar) => {
				if (!this.userCar.id) {
					this.navigationService.navigate([`/user-cars`, userCar.id]);
				}

				this.initUserCar(userCar);
				this.userCarUpdated = true;
			}
		});
	}
}
