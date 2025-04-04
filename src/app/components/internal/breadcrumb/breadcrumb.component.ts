import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Brand } from "../../../models/brand.model";
import { TranslateModule } from "@ngx-translate/core";
import { Car } from "../../../models/car.model";
import { Engine } from "../../../models/engine.model";
import { MenuItem, PrimeTemplate } from "primeng/api";
import { Breadcrumb } from "primeng/breadcrumb";
import { UserCar } from "../../../models/user-car.model";
import { LanguageService } from "../../../services/language.service";
import { LanguageLinkPipe } from "../../../services/language-link.pipe";

interface BreadcrumbItem {
	label: string | undefined;
	urlPart: any;
	items?: BreadcrumbItem[];
}

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss'],
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		CommonModule, RouterLink, TranslateModule, Breadcrumb, PrimeTemplate, LanguageLinkPipe
	]
})
export class BreadcrumbComponent implements OnChanges, OnInit {

	items: BreadcrumbItem[] = [];

	@Input() brand?: Brand | null;
	@Input() car?: Car | null;
	@Input() engine?: Engine | null;
	@Input() userCar?: UserCar | null;

	@Input() marginBottom: number = 48;

	menuItems: MenuItem[] = [];
	home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

	private getBrand(): Brand | null | undefined {
		return this.brand ?? this.car?.brand ?? this.engine?.car?.brand;
	}

	private getCar(): Car | undefined {
		return this.car ?? this.engine?.car;
	}

	constructor(private router: Router, private languageService: LanguageService) {

	}

	ngOnInit(): void {
		this.init();
	}

	ngOnChanges(): void {
		this.init();
	}

	private init() {
		const breadcrumbItems: BreadcrumbItem[] = [
			{
				label: 'BREADCRUMB_HOME',
				urlPart: '/',
				items: [
					{
						label: 'BREADCRUMB_BRANDS',
						urlPart: 'brands',
						items: [
							{ label: 'BREADCRUMB_CREATE_BRAND', urlPart: 'create' },
							{ label: 'BREADCRUMB_CHANGE_BRAND', urlPart: this.getBrand()?.id }
						]
					},
					{
						label: 'BREADCRUMB_BRANDS',
						urlPart: 'cars',
						items: [
							{
								label: this.getBrand()?.brand,
								urlPart: this.getBrand()?.id,
								items: [
									{ label: 'BREADCRUMB_CREATE_CAR', urlPart: 'create' },
									{
										label: this.getCar()?.model,
										urlPart: this.getCar()?.id,
										items: [
											{
												label: 'BREADCRUMB_CAR_ENGINES',
												urlPart: 'engines',
												items: [
													{ label: 'BREADCRUMB_CREATE_ENGINE', urlPart: 'create' },
													{ label: 'BREADCRUMB_CHANGE_ENGINE', urlPart: this.engine?.id }
												]
											}
										]
									}
								]
							}
						]
					},
					{ label: 'BREADCRUMB_SERVICES', urlPart: 'services' },
					{ label: 'BREADCRUMB_ALERTS', urlPart: 'alerts' },
					{ label: 'BREADCRUMB_SETTINGS', urlPart: 'profile' },
					{
						label: 'BREADCRUMB_MY_CARS',
						urlPart: 'user-cars',
						items: [
							{ label: 'BREADCRUMB_CREATE_USER_CAR', urlPart: 'create' },
							{ label: this.userCar?.licensePlate, urlPart: this.userCar?.id }
						]
					}
				]
			}
		];

		this.buildBreadcrumbs(breadcrumbItems);
	}

	private buildBreadcrumbs(items: BreadcrumbItem[]): void {
		this.menuItems = [];
		const urlSegments = this.router.url.split('/').filter(Boolean);

		if (urlSegments[0] === this.languageService.language) {
			urlSegments.splice(0, 1);
		}

		let currentPath = [];

		for (const segment of urlSegments) {
			const item = this.findBreadcrumbItem(items, segment);
			if (!item) {
				break;
			}

			this.menuItems.push({
				label: item.label,
				routerLink: [...currentPath, segment]
			});

			currentPath.push(segment);

			items = item.items ?? [];
		}

		const length: number = this.menuItems.length;
		if (length > 0) {
			this.menuItems[length - 1].routerLink = null;
		}
	}

	private findBreadcrumbItem(items: BreadcrumbItem[], segment: string): BreadcrumbItem | undefined {
		for (const item of items) {
			if (item.urlPart?.toString() === segment) {
				return item;
			}
			if (item.items) {
				const found = this.findBreadcrumbItem(item.items, segment);
				if (found) return found;
			}
		}
		return undefined;
	}
}
