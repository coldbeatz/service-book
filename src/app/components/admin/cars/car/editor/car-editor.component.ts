import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CustomFileUploadComponent } from "../../../../shared/custom-file-upload/custom-file-upload.component";
import { TranslateModule } from "@ngx-translate/core";
import { CarTransmissionType } from "../../../../../models/car-transmission-type.model";
import { Car } from "../../../../../models/car.model";
import { CarService } from "../../../../../services/api/car.service";
import { NavigationService } from "../../../../../services/navigation.service";
import { AlertComponent } from "../../../../internal/alert/alert.component";
import { CarTransmissionService } from "../../../../../services/car-transmission.service";

@Component({
	selector: 'car-editor-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'car-editor.component.html',
	styleUrls: ['car-editor.component.scss'],
	imports: [
		ReactiveFormsModule,
		CommonModule,
		CustomFileUploadComponent,
		TranslateModule,
		AlertComponent
	],
	standalone: true
})
export class CarEditorComponent implements OnInit, OnChanges {

	protected form: FormGroup;

	currentYear: number;

	@Input() car!: Car;

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	availableTransmissions: { value: CarTransmissionType; label: string } [] = [];

	success: boolean = false;

	constructor(private carService: CarService,
				private fb: FormBuilder,
				private navigationService: NavigationService,
				private carTransmissionService: CarTransmissionService) {

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

	setDefaultImage($event: ErrorEvent) {
		const imgElement = $event.target as HTMLImageElement;
		imgElement.src = 'assets/images/no-picture.jpg';
	}

	ngOnInit(): void {
		this.carTransmissionService.transmissionOptions$.subscribe((options) => {
			this.availableTransmissions = options.filter(option => option.value !== CarTransmissionType.OTHER);

			const formGroupConfig: { [key: string]: boolean } = {};
			this.availableTransmissions.forEach((transmission) => {
				formGroupConfig[transmission.value] = false;
			});

			this.form.setControl('transmissions', this.fb.group(formGroupConfig));

			this.initCarTransmissions();
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['car'] && this.car) {
			this.form.patchValue({
				model: this.car.model,
				startYear: this.car.startYear,
				endYear: this.car.endYear,
			});

			this.imagePreview = this.car.imageResource?.url || null;

			this.initCarTransmissions();
		}
	}

	private initCarTransmissions(): void {
		if (!this.car || !this.car.transmissions || this.availableTransmissions.length === 0) return;

		const transmissionsGroup = this.form.get('transmissions') as FormGroup;

		Object.keys(transmissionsGroup.controls).forEach(key => {
			transmissionsGroup.controls[key].setValue(false);
		});

		this.car.transmissions.forEach((transmission) => {
			if (transmissionsGroup.controls[transmission]) {
				transmissionsGroup.controls[transmission].setValue(true);
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

		if (this.car.brand == null)
			return;

		const transmissions = this.getSelectedTransmissions();

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
						this.navigationService.navigate([`/cars`, this.car.brand?.id, car.id]);
					}

					this.car = car;
					this.success = true;
				}
			}
		});
	}
}
