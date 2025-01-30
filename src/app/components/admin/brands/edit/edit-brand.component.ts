import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ApiRequestsService } from "../../../../services/api-requests.service";
import { Country } from "../../../../models/country.model";
import { environment } from "../../../../../environments/environment";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NavigationService } from "../../../../services/navigation.service";
import { Brand } from "../../../../models/brand.model";
import { BreadcrumbComponent } from "../../../internal/breadcrumb/breadcrumb.component";
import { MainComponent } from "../../../internal/main/main.component";
import { AlertComponent } from "../../../internal/alert/alert.component";
import { NgForOf, NgIf } from "@angular/common";
import { CustomFileUploadComponent } from "../../../shared/custom-file-upload/custom-file-upload.component";
import { TranslateModule } from "@ngx-translate/core";

@Component({
	selector: 'edit-brand-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'edit-brand.component.html',
	styleUrls: ['../create/create-brand.component.scss'],
	imports: [
		BreadcrumbComponent,
		MainComponent,
		ReactiveFormsModule,
		AlertComponent,
		NgIf,
		NgForOf,
		CustomFileUploadComponent,
		TranslateModule
	],
	standalone: true
})
export class EditBrandComponent implements OnInit {

	brand: Brand | null = null;

	countries: Country[] = [];

	selectedCountry: Country | null = null;
	selectedFile: File | null = null;

	imagePreview: string | null = null;

	success: boolean = false;

	protected form: FormGroup;

	@Input() id!: string;

	constructor(private apiRequestsService: ApiRequestsService,
				private fb: FormBuilder,
				private navigationService: NavigationService) {

		this.form = this.fb.group({
			brand: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
		this.apiRequestsService.getCountries().subscribe({
			next: (response) => {
				this.countries = response;
			},
			error: (e) => {
				console.log(e);
			}
		});

		this.apiRequestsService.getBrandById(Number(this.id)).subscribe({
			next: (response) => {
				this.brand = response;

				if (this.brand?.country) {
					this.selectCountry(this.brand.country);
				}

				this.imagePreview = environment.resourcesUrl + "/" + this.brand?.imageResource.url;

				this.form.patchValue({
					brand: this.brand?.brand
				});
			},
			error: (e) => {
				if (e.error.code == 'car_brand_not_found') {
					this.navigationService.navigate('brands');
				}
			}
		});
	}

	protected readonly environment = environment;

	selectCountry(country: Country | null): void {
		this.selectedCountry = country;
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

	onSubmit() {
		const data = this.form.value;

		if (!this.brand)
			return;

		this.brand.brand = data.brand;
		this.brand.country = this.selectedCountry;

		this.apiRequestsService.editBrand(this.brand, this.selectedFile).subscribe({
			next: (response) => {
				if (response.result === 'success') {
					this.success = true;
				}
			},
			error: (e) => {
				this.success = false;
			}
		});
	}
}
