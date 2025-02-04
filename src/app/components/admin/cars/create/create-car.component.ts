import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ApiRequestsService } from "../../../../services/api-requests.service";
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
import { TranslateModule } from "@ngx-translate/core";

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
	car: Car | null = null;

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	availableTransmissions: string[] = [];

	success: boolean = false;

	constructor(private apiRequestsService: ApiRequestsService,
				private fb: FormBuilder,
				private navigationService: NavigationService,
				private route: ActivatedRoute) {

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

	ngOnInit(): void {
		let id = this.route.snapshot.paramMap.get('id');

		this.apiRequestsService.getBrandById(Number(id)).subscribe({
			next: (brand) => {
				this.brand = brand;
			},
			error: (e) => {
				if (e.error.code == 'car_brand_not_found') {
					this.navigationService.navigate(['brands']);
				}
			}
		});

		this.apiRequestsService.getTransmissions().subscribe({
			next: (transmissions) => {
				this.availableTransmissions = transmissions;

				const formGroupConfig: { [key: string]: boolean } = {};
				transmissions.forEach((transmission) => {
					formGroupConfig[transmission] = false;
				});

				this.form.setControl('transmissions', this.fb.group(formGroupConfig));

				this.initCar();
			}
		});
	}

	initCar() {
		let carId = this.route.snapshot.paramMap.get('carId');

		if (carId == null)
			return;

		this.apiRequestsService.getCarById(Number(carId)).subscribe({
			next: (car) => {
				if (car == null) return;

				this.car = car;

				this.form.patchValue({
					model: this.car.model,
					startYear: this.car.startYear,
					endYear: this.car.endYear,
				});

				this.imagePreview = environment.resourcesUrl + "/" + car.imageResource.url;

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

	getSelectedTransmissions(): string[] {
		const transmissions = this.form.get('transmissions')?.value || {};
		return Object.keys(transmissions).filter((key) => transmissions[key]);
	}

	onSubmit() {
		const data = this.form.value;

		if (this.brand == null)
			return;

		const transmissions = this.getSelectedTransmissions();

		if (this.car != null) {
			this.car.model = data.model;
			this.car.startYear = data.startYear;
			this.car.endYear = data.endYear;
			this.car.transmissions = transmissions;

			this.apiRequestsService.updateCar(this.car, this.selectedFile).subscribe({
				next: (car) => {
					if (car.id != null) {
						this.success = true;
					}
				}
			});
		} else {
			if (this.selectedFile == null)
				return;

			this.apiRequestsService.createCar(this.brand, data.model, data.startYear, data.endYear,
											  this.selectedFile, transmissions).subscribe({
				next: (car) => {
					this.navigationService.navigate([`/cars/${this.brand?.id}/${car?.id}`]);
				},
				error: (e) => {
					console.log(e);
				}
			});
		}


	}
}
