import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { faFacebook, faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import {ApiRequestsService} from "../../../services/api-requests.service";
import {ApiErrorsService} from "../../../services/api-errors.service";
import {AuthService} from "../../../services/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Brand} from "../../../models/brand.model";
import {environment} from "../../../../environments/environment";
import {Country} from "../../../models/country.model";

@Component({
	selector: 'brands-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'brands.component.html',
	styleUrls: ['brands.component.scss'],
})
export class BrandsComponent implements OnInit {

	protected readonly environment = environment;

	selectedCountry: Country | null = null;

	/**
	 * Текст для пошуку
	 */
	searchTerm: string = '';

	brands: Brand[] = [];
	countries: Country[] = [];

	constructor(private apiRequestsService: ApiRequestsService) {

	}

	ngOnInit(): void {
		this.apiRequestsService.getBrands().subscribe({
			next: (response) => {
				this.brands = response;

				this.countries = response
					.map((brand: Brand) => brand.country)
					.filter((country: Country, index: number, self: Country[]) =>
						self.findIndex((c: Country) => c.id === country.id) === index
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
