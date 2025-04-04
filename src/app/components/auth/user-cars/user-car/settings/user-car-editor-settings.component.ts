import {
	AfterViewInit,
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { Select } from "primeng/select";
import { FormInputComponent } from "../../../../shared/form/form-input/form-input.component";
import { NumberFormInputComponent } from "../../../../shared/form/number-form-input/number-form-input.component";
import { CustomFileUploadComponent } from "../../../../shared/custom-file-upload/custom-file-upload.component";
import { AlertComponent } from "../../../../internal/alert/alert.component";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { BootstrapButtonComponent } from "../../../../shared/button/bootstrap-button.component";
import { Car } from "../../../../../models/car.model";
import { UserCar } from "../../../../../models/user-car.model";
import { Brand } from "../../../../../models/brand.model";
import { BrandOption, BrandService } from "../../../../../services/api/brand.service";
import { CarOption, CarService } from "../../../../../services/api/car.service";
import { CarTransmissionService, TransmissionOption } from "../../../../../services/car-transmission.service";
import { UserCarService } from "../../../../../services/api/user-car.service";
import { FuelTypeService } from "../../../../../services/fuel-type.service";
import { CarTransmissionType } from "../../../../../models/car-transmission-type.model";
import { NavigationService } from "../../../../../services/navigation.service";
import { environment } from "../../../../../../environments/environment";

@Component({
	selector: 'user-car-editor-profile-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'user-car-editor-settings.component.html',
	styleUrls: ['user-car-editor-settings.component.scss'],
	imports: [
		CommonModule,
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
export class UserCarEditorSettingsComponent implements OnInit, AfterViewInit {

	@Input() userCar!: UserCar;

	/**
	 * Список всіх брендів
	 */
	brands: Brand[] = [];

	/**
	 * Список автомобілів за брендом
	 */
	carsByBrand: Car[] = [];

	brandsOptions: BrandOption[] = [];
	carsOptions: CarOption[] = [];

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	transmissionOptions: TransmissionOption[] = [];

	/**
	 * Обраний бренд
	 */
	selectedBrand: Brand | null = null;

	/**
	 * Прапор успішності збереження автомобіля
	 */
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

	ngAfterViewInit(): void {
		this.initUserCar(this.userCar);
	}

	ngOnInit(): void {
		this.route.data.subscribe(data => {
			this.userCar = data['userCar'];
		});

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
	}

	private initUserCar(userCar: UserCar): void {
		this.userCar = userCar;

		this.selectedBrand = userCar.car?.brand ?? null;

		if (this.selectedBrand) {
			this.onBrandSelected(this.selectedBrand);
		}

		if (userCar.imageResource) {
			this.imagePreview = userCar.imageResource.url;
		}
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

		this.updateTransmissionOptions(car ? car.transmissions : []);
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
					this.navigationService.navigate([`user-cars`, userCar.id]);
				}

				this.initUserCar(userCar);
				this.userCarUpdated = true;
			}
		});
	}

	setDefaultImage($event: ErrorEvent) {
		const imgElement = $event.target as HTMLImageElement;
		imgElement.src = 'assets/images/no-picture.jpg';
	}

	protected readonly environment = environment;
}
