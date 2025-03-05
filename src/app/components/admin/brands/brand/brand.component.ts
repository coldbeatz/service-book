import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Country } from "../../../../models/country.model";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NavigationService } from "../../../../services/navigation.service";
import { MainComponent } from "../../../internal/main/main.component";
import { BreadcrumbComponent } from "../../../internal/breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { CustomFileUploadComponent } from "../../../shared/custom-file-upload/custom-file-upload.component";
import { TranslateModule } from "@ngx-translate/core";
import { Brand } from "../../../../models/brand.model";
import { AlertComponent } from "../../../internal/alert/alert.component";
import { ActivatedRoute } from "@angular/router";
import { BrandService } from "../../../../services/api/brand.service";
import { CountryService } from "../../../../services/api/country.service";

@Component({
	selector: 'create-brand-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'brand.component.html',
	styleUrls: ['brand.component.scss'],
	imports: [
		MainComponent,
		BreadcrumbComponent,
		ReactiveFormsModule,
		CommonModule,
		CustomFileUploadComponent,
		TranslateModule,
		FormsModule,
		AlertComponent
	],
	standalone: true
})
export class BrandComponent implements OnInit {

	countries: Country[] = [];

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	success: boolean = false;

	errorCode: string | null = null;

	@Input() brand!: Brand;

	constructor(private brandService: BrandService,
				private countryService: CountryService,
				private navigationService: NavigationService,
				private route: ActivatedRoute) {

	}

	private createEmptyBrand(): Brand {
		return {
			id: 0,
			brand: '',
			country: null,
			imageResource: {
				url: ''
			}
		}
	}

	ngOnInit(): void {
		this.brand = this.createEmptyBrand();

		this.countryService.getCountries().subscribe({
			next: (countries) => {
				this.countries = countries;
			}
		});

		const id = this.route.snapshot.paramMap.get("id");
		if (id) {
			this.brandService.getBrandById(Number(id)).subscribe({
				next: (brand) => {
					this.brand = brand;

					this.imagePreview = this.brand?.imageResource.url;
				},
				error: (e) => {
					if (e.error.code == 'car_brand_not_found') {
						this.navigationService.navigate(['brands']);
					}
				}
			});
		}
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
		const brandExists = this.brand.id && this.brand.id != 0;

		if (!brandExists) {
			if (this.selectedFile == null)
				return;
		}

		this.brandService.saveOrUpdateBrand(this.brand, this.selectedFile).subscribe({
			next: (brand) => {
				this.errorCode = null;

				const isNewBrand = this.brand.id == 0;

				if (brand.id) {
					if (isNewBrand) {
						this.navigationService.navigate(['/brands', brand.id]);
					}

					this.success = true;
				}
			},
			error: (e) => {
				this.errorCode = null;
				this.success = false;

				if (e.error.code == 'car_brand_not_found') {
					this.navigationService.navigate(['brands']);
				} else {
					this.errorCode = e.error;
				}
			}
		});
	}
}
