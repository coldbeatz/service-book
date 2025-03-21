import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Brand } from "../../../models/brand.model";
import { Country } from "../../../models/country.model";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { MainComponent } from "../../internal/main/main.component";
import { RouterLink } from "@angular/router";
import { DropdownComponent } from "../../shared/dropdown/dropdown.component";
import { NgForOf, NgIf } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { BrandService } from "../../../services/api/brand.service";
import { LeftPanelComponent } from "../../shared/left-panel/left-panel.component";
import { MenuItem, PrimeIcons } from "primeng/api";
import { BootstrapButtonComponent } from "../../shared/button/bootstrap-button.component";
import { Button } from "primeng/button";
import { InputGroup } from "primeng/inputgroup";
import { InputGroupAddon } from "primeng/inputgroupaddon";
import { InputText } from "primeng/inputtext";
import { Tooltip } from "primeng/tooltip";
import { NavigationService } from "../../../services/navigation.service";

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
		TranslateModule,
		LeftPanelComponent,
		BootstrapButtonComponent,
		Button,
		InputGroup,
		InputGroupAddon,
		InputText,
		Tooltip
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

	constructor(private brandService: BrandService,
				private translateService: TranslateService,
				private navigationService: NavigationService) {

	}

	get menuItems(): MenuItem[] {
		return [
			{
				label: this.translateService.instant("BRANDS_LIST"),
				id: 'brands',
				expanded: true,
				items: [
					{
						label: this.translateService.instant("BRANDS_ADD_CAR_BRAND_BUTTON"),
						id: 'create_brand',
						icon: PrimeIcons.PLUS,
						command: () => {
							this.navigationService.navigate(['/brands', 'create']);
						}
					},
					...this.filteredBrands.map(brand => ({
						label: brand.brand + ' (' + brand.carsCount + ')',
						id: `brand_${brand.id}`,
						icon: PrimeIcons.CAR,
						command: () => {
							this.navigationService.navigate(['/cars', brand.id]);
						}
					}))
				]
			}
		];
	}

	ngOnInit(): void {
		this.brandService.getBrands().subscribe({
			next: (response) => {
				this.brands = response;

				this.brands.forEach(brand => {
					this.brandService.getCarsCountByBrand(brand).subscribe({
						next: (response) => brand.carsCount = response.count
					});
				});

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

	get filteredBrands(): Brand[] {
		return this.brands.filter(brand => {
			return brand.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
				   (!this.selectedCountry || brand.country?.id === this.selectedCountry.id)
		});
	}

	clearSearchInput(): void {
		this.searchTerm = '';
	}
}
