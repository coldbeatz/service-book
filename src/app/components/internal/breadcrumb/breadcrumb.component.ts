import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Brand } from "../../../models/brand.model";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Car } from "../../../models/car.model";
import { Engine } from "../../../models/engine.model";
import { MenuItem, PrimeTemplate } from "primeng/api";
import { Breadcrumb } from "primeng/breadcrumb";

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
		CommonModule, RouterLink, TranslateModule, Breadcrumb, PrimeTemplate
	]
})
export class BreadcrumbComponent implements OnChanges, OnInit {

	items: BreadcrumbItem[] = [];

	@Input() brand?: Brand | null;
	@Input() car?: Car | null;
	@Input() engine?: Engine | null;

	menuItems: MenuItem[] = [];
	home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

	private getBrand(): Brand | null | undefined {
		return this.brand ?? this.car?.brand ?? this.engine?.car?.brand;
	}

	private getCar(): Car | undefined {
		return this.car ?? this.engine?.car;
	}

	constructor(private router: Router, private translate: TranslateService) {}

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
					{ label: 'BREADCRUMB_SETTINGS', urlPart: 'settings' },
					{
						label: 'BREADCRUMB_MY_CARS',
						urlPart: 'user-cars',
						items: [
							{ label: 'BREADCRUMB_CREATE_USER_CAR', urlPart: 'new' }
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
		let currentPath = '';

		for (const segment of urlSegments) {
			const item = this.findBreadcrumbItem(items, segment);
			if (!item) {
				break;
			}

			currentPath += `/${segment}`;
			this.menuItems.push({
				label: item.label,
				routerLink: currentPath
			});

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
