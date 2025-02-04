import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Brand } from "../../../models/brand.model";
import { TranslateModule } from "@ngx-translate/core";
import { Car } from "../../../models/car.model";
import { Engine } from "../../../models/engine.model";

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
	imports: [
		CommonModule, RouterLink, TranslateModule
	]
})
export class BreadcrumbComponent implements OnChanges, OnInit {

	items: BreadcrumbItem[] = [];

	@Input() brand?: Brand;
	@Input() car?: Car;
	@Input() engine?: Engine;

	private getBrand(): Brand | undefined {
		return this.brand ?? this.car?.brand ?? this.engine?.car?.brand;
	}

	private getCar(): Car | undefined {
		return this.car ?? this.engine?.car;
	}

	constructor(private router: Router) {}

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
					{ label: 'BREADCRUMB_SERVICES', urlPart: 'services' }
				]
			}
		];

		this.buildBreadcrumbs(breadcrumbItems);
	}

	private buildBreadcrumbs(items: BreadcrumbItem[]): void {
		this.items = [];

		const urlSegments = this.router.url.split('/').filter(Boolean);

		this.items.push(items[0])

		let currentItems = items[0].items ?? [];
		for (const segment of urlSegments) {
			const item = currentItems.find(item => item.urlPart?.toString() === segment);
			if (!item) break;

			this.items.push(item);
			currentItems = item.items ?? [];
		}
	}

	getFullUrl(index: number): string {
		return '/' + this.items.slice(1, index + 1).map(item => item.urlPart).join('/');
	}
}
