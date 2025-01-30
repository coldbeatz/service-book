import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ApiRequestsService } from "../../../../services/api-requests.service";
import { Country } from "../../../../models/country.model";
import { environment } from "../../../../../environments/environment";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NavigationService } from "../../../../services/navigation.service";
import { MainComponent } from "../../../internal/main/main.component";
import { BreadcrumbComponent } from "../../../internal/breadcrumb/breadcrumb.component";
import { NgForOf, NgIf } from "@angular/common";
import { CustomFileUploadComponent } from "../../../shared/custom-file-upload/custom-file-upload.component";
import { TranslateModule } from "@ngx-translate/core";

@Component({
	selector: 'create-brand-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'create-brand.component.html',
	styleUrls: ['create-brand.component.scss'],
	imports: [
		MainComponent,
		BreadcrumbComponent,
		ReactiveFormsModule,
		NgIf,
		NgForOf,
		CustomFileUploadComponent,
		TranslateModule
	],
	standalone: true
})
export class CreateBrandComponent implements OnInit {

	countries: Country[] = [];

	selectedCountry: Country | null = null;
	selectedFile: File | null = null;

	imagePreview: string | null = null;

	protected form: FormGroup;

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

		if (this.selectedFile == null)
			return;

		this.apiRequestsService.createBrand(data.brand, this.selectedCountry, this.selectedFile).subscribe({
			next: (response) => {
				if (response.result === 'success') {
					this.navigationService.navigate('brands');
				}
			},
			error: (e) => {
				console.log(e);
			}
		});
	}
}
