import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NavigationService } from "../../../../services/navigation.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Brand } from "../../../../models/brand.model";
import { Car } from "../../../../models/car.model";
import { environment } from "../../../../../environments/environment";
import { BreadcrumbComponent } from "../../../internal/breadcrumb/breadcrumb.component";
import { NgForOf, NgIf } from "@angular/common";
import { MainComponent } from "../../../internal/main/main.component";
import { AlertComponent } from "../../../internal/alert/alert.component";
import { CustomFileUploadComponent } from "../../../shared/custom-file-upload/custom-file-upload.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CarTransmissionType } from "../../../../models/car-transmission-type.model";
import { BrandService } from "../../../../services/api/brand.service";
import { CarService } from "../../../../services/api/car.service";

@Component({
	selector: 'create-car-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'create-car.component.html',
	styleUrls: ['create-car.component.scss'],
	imports: [
		BreadcrumbComponent,
		ReactiveFormsModule,
		NgIf,
		MainComponent,
		AlertComponent,
		CustomFileUploadComponent,
		RouterLink,
		NgForOf,
		TranslateModule
	],
	standalone: true
})
export class CreateCarComponent implements OnInit {

	protected form: FormGroup;

	currentYear: number;

	brand: Brand | null = null;
	car: Car = new Car();

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	availableTransmissions: { value: CarTransmissionType; label: string } [] = [];

	success: boolean = false;

	constructor(private carService: CarService,
				private brandService: BrandService,
				private fb: FormBuilder,
				private navigationService: NavigationService,
				private route: ActivatedRoute,
				private translate: TranslateService) {

		this.currentYear = new Date().getFullYear();

		this.form = this.fb.group({
			model: ['', [Validators.required]],
			startYear: ['', [
				Validators.required,
				Validators.min(1900),
				Validators.max(this.currentYear)
			]],
			endYear: ['', [
				Validators.min(1900),
				Validators.max(this.currentYear)
			]],
			transmissions: this.fb.array(this.availableTransmissions.map(() => false))
		});
	}

	private initAvailableTransmissions(): void {
		const enumKeys = Object.keys(CarTransmissionType)
			.filter(key => isNaN(Number(key)) && key !== "OTHER");

		const translationKeys = enumKeys.map(key => `TRANSMISSION_${key}`);

		this.translate.get(translationKeys).subscribe((translations: { [key: string]: string }) => {
			this.availableTransmissions = enumKeys.map(key => ({
				value: CarTransmissionType[key as keyof typeof CarTransmissionType],
				label: translations[`TRANSMISSION_${key}`]
			}));

			const formGroupConfig: { [key: string]: boolean } = {};
			this.availableTransmissions.forEach((transmission) => {
				formGroupConfig[transmission.value] = false;
			});

			this.form.setControl('transmissions', this.fb.group(formGroupConfig));
		});
	}

	ngOnInit(): void {
		let brandId = Number(this.route.snapshot.paramMap.get('brand'));

		this.brandService.getBrandById(brandId).subscribe({
			next: (brand) => {
				this.brand = brand;
			},
			error: (e) => {
				if (e.error.code == 'car_brand_not_found') {
					this.navigationService.navigate(['brands']);
				}
			}
		});

		this.initAvailableTransmissions();
		this.initCar();
	}

	initCar() {
		let carId = this.route.snapshot.paramMap.get('carId');

		if (carId == null)
			return;

		this.carService.getCarById(Number(carId)).subscribe({
			next: (car) => {
				if (car == null) return;

				this.car = car;

				this.form.patchValue({
					model: this.car.model,
					startYear: this.car.startYear,
					endYear: this.car.endYear,
				});

				this.imagePreview = car.imageResource?.url || null;

				if (car.transmissions.length > 0) {
					const transmissionsGroup = this.form.get('transmissions') as FormGroup;

					car.transmissions.forEach((transmission) => {
						if (transmissionsGroup.controls[transmission]) {
							transmissionsGroup.controls[transmission].setValue(true);
						}
					});
				}
			}
		});
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

	getSelectedTransmissions(): CarTransmissionType[] {
		const transmissions = this.form.get('transmissions')?.value || {};

		return Object.keys(transmissions)
			.filter((key) => transmissions[key]) as unknown as CarTransmissionType[];
	}

	onSubmit() {
		const data = this.form.value;

		if (this.brand == null)
			return;

		const transmissions = this.getSelectedTransmissions();

		this.car.brand = this.brand;
		this.car.model = data.model;
		this.car.startYear = data.startYear;
		this.car.endYear = data.endYear;
		this.car.transmissions = transmissions;

		if (!this.car.id && this.selectedFile == null)
			return;

		this.carService.saveOrUpdateCar(this.car, this.selectedFile).subscribe({
			next: (car) => {
				if (car.id != null) {
					if (!this.car.id) {
						this.navigationService.navigate([`/cars`, this.brand?.id, car.id]);
					}

					this.car = car;
					this.success = true;
				}
			}
		});
	}
}
