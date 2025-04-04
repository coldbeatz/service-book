import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NavigationService } from "../../../../services/navigation.service";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { Car } from "../../../../models/car.model";
import { BreadcrumbComponent } from "../../../internal/breadcrumb/breadcrumb.component";
import { CommonModule } from "@angular/common";
import { MainComponent } from "../../../internal/main/main.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { BrandService } from "../../../../services/api/brand.service";
import { LeftPanelComponent } from "../../../shared/left-panel/left-panel.component";
import { MenuItem, PrimeIcons } from "primeng/api";
import { EngineEventService } from "./engines/engine/engine-event.service";

@Component({
	selector: 'car-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'car.component.html',
	styleUrls: ['car.component.scss'],
	imports: [
		BreadcrumbComponent,
		ReactiveFormsModule,
		CommonModule,
		MainComponent,
		TranslateModule,
		LeftPanelComponent,
		RouterOutlet
	],
	standalone: true
})
export class CarComponent implements OnInit {

	car: Car = new Car();

	constructor(private brandService: BrandService,
				private navigationService: NavigationService,
				private route: ActivatedRoute,
				private translateService: TranslateService,
				private cdr: ChangeDetectorRef,
				private engineEventService: EngineEventService) {
	}

	get menuItems(): MenuItem[] {
		return [
			{
				label: this.translateService.instant("CAR_SETTINGS"),
				id: "profile",
				icon: PrimeIcons.COG,
				routerLink: ['cars', this.car?.brand?.id, this.car.id],
			},
			...(this.car.id? [
				{
					label: this.translateService.instant("REGULATIONS_MAINTENANCE"),
					id: "maintenance",
					icon: PrimeIcons.WRENCH,
					routerLink: ['cars', this.car?.brand?.id, this.car.id, 'maintenance'],
				},
				{
					label: this.translateService.instant("ENGINES_LIST"),
					id: "engines",
					icon: PrimeIcons.CAR,
					expanded: true,
					items: [
						{
							label: this.translateService.instant("ENGINES_ALL_BUTTON"),
							id: 'all_engines',
							icon: PrimeIcons.EYE,
							routerLink: ['cars', this.car?.brand?.id, this.car.id, 'engines'],
						},
						{
							label: this.translateService.instant("ENGINES_ADD_CAR_ENGINE_BUTTON"),
							id: 'create_engine',
							icon: PrimeIcons.PLUS,
							routerLink: ['cars', this.car?.brand?.id, this.car.id, 'engines', 'create']
						},
						...this.car.engines.map(engine => ({
							label: engine.name,
							id: `engine_${engine.id}`,
							icon: PrimeIcons.COG,
							routerLink: ['cars', this.car?.brand?.id, this.car.id, 'engines', engine.id]
						}))
					]
				}
			] : [])
		];
	}

	ngOnInit(): void {
		this.engineEventService.engineListChanged$.subscribe((updatedEngines) => {
			this.car.engines = updatedEngines;
			this.cdr.detectChanges();
		});

		this.route.data.subscribe(data => {
			const car = data['car'];

			let brandId = Number(this.route.snapshot.paramMap.get('brand'));

			this.brandService.getBrandById(brandId).subscribe({
				next: (brand) => {
					car.brand = brand;
					this.car = car;
				},
				error: (e) => {
					if (e.error.code == 'car_brand_not_found') {
						this.navigationService.navigate(['brands']);
					}
				}
			});
		});
	}
}
