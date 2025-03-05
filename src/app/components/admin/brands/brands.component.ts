import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Brand } from "../../../models/brand.model";
import { Country } from "../../../models/country.model";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { MainComponent } from "../../internal/main/main.component";
import { RouterLink } from "@angular/router";
import { DropdownComponent } from "../../shared/dropdown/dropdown.component";
import { NgForOf, NgIf } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { BrandService } from "../../../services/api/brand.service";

@Component({
	selector: 'brands-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'brands.component.html',
	styleUrls: ['brands.component.scss'],
	imports: [
		BreadcrumbComponent,
		MainComponent,
		RouterLink,
		DropdownComponent,
		FormsModule,
		NgForOf,
		NgIf,
		TranslateModule
	],
	standalone: true
})
export class BrandsComponent implements OnInit {

	selectedCountry: Country | null = null;

	/**
	 * Текст для пошуку
	 */
	searchTerm: string = '';

	brands: Brand[] = [];
	countries: Country[] = [];

	constructor(private brandService: BrandService) {

	}

	ngOnInit(): void {
		this.brandService.getBrands().subscribe({
			next: (response) => {
				this.brands = response;

				this.countries = response
					.map((brand: Brand) => brand.country)
					.filter((country: Country | null): country is Country => country !== null)
					.filter((country: Country, index: number, self: Country[]) =>
						self.findIndex((c: Country) => c?.id === country.id) === index
					);
			},
			error: (e) => {
				console.log(e);
			}
		});
	}

	getBrandsCountByCountry(country: Country | null): number {
		if (country == null)
			return this.brands.length;

		return this.brands.filter(brand => brand.country?.id === country.id).length;
	}

	selectCountry(country: Country | null): void {
		this.selectedCountry = country;
	}

	get filteredBrands() {
		if (!this.searchTerm.trim()) {
			return this.brands;
		}

		return this.brands.filter(brand => brand.brand.toLowerCase()
			.includes(this.searchTerm.toLowerCase()));
	}

	clearSearchInput(): void {
		this.searchTerm = '';
	}
}
