import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ApiRequestsService } from "../../../../services/api-requests.service";
import { Country } from "../../../../models/country.model";
import { environment } from "../../../../../environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavigationService } from "../../../../services/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { Brand } from "../../../../models/brand.model";

@Component({
	selector: 'edit-brand-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'edit-brand.component.html',
	styleUrls: ['../create/create-brand.component.scss'],
})
export class EditBrandComponent implements OnInit {

	id: string | null = null;

	brand: Brand | null = null;

	countries: Country[] = [];

	selectedCountry: Country | null = null;
	selectedFile: File | null = null;

	imagePreview: string | null = null;

	success: boolean = false;

	protected form: FormGroup;

	constructor(private apiRequestsService: ApiRequestsService,
				private fb: FormBuilder,
				private navigationService: NavigationService,
				private route: ActivatedRoute) {

		this.form = this.fb.group({
			brand: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get('id');

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
