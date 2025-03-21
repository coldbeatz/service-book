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
import { CarService } from "../../../../services/api/car.service";
import { LeftPanelComponent } from "../../../shared/left-panel/left-panel.component";
import { MenuItem, PrimeIcons } from "primeng/api";
import { Engine } from "../../../../models/engine.model";
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

	leftPanelSelectedItem: string = "";

	constructor(private carService: CarService,
				private brandService: BrandService,
				private navigationService: NavigationService,
				private route: ActivatedRoute,
				private translateService: TranslateService,
				private cdr: ChangeDetectorRef,
				private engineEventService: EngineEventService) {
	}

	openCarSettings() {
		if (this.car && this.car.brand) {
			this.navigationService.updateUrlIfChanged([`/cars/${this.car.brand.id}/${this.car.id}`]);
		}

		this.leftPanelSelectedItem = 'settings';
	}

	openCarMaintenance() {
		if (this.car && this.car.brand) {
			this.navigationService.updateUrlIfChanged([`/cars/${this.car.brand.id}/${this.car.id}/maintenance`]);
		}

		this.leftPanelSelectedItem = 'maintenance';
	}

	openCarEngines() {
		if (this.car && this.car.brand) {
			this.navigationService.updateUrlIfChanged([`/cars/${this.car.brand.id}/${this.car.id}/engines`]);
		}

		this.leftPanelSelectedItem = 'all_engines';
	}

	openCarEngine(engine: Engine | null) {
		const urlPart = engine ? engine.id : 'create';

		if (this.car && this.car.brand) {
			this.navigationService.updateUrlIfChanged([`/cars/${this.car.brand.id}/${this.car.id}/engines/${urlPart}`]);
		}

		this.leftPanelSelectedItem = 'engine_' + engine?.id;
	}

	get menuItems(): MenuItem[] {
		return [
			{
				label: 'Car settings',
				id: "settings",
				icon: PrimeIcons.COG,
				command: () => this.openCarSettings()
			},
			...(this.car.id? [
				{
					label: 'Regulations maintenance',
					id: "maintenance",
					icon: PrimeIcons.WRENCH,
					command: () => this.openCarMaintenance()
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
							command: () => this.openCarEngines()
						},
						{
							label: this.translateService.instant("ENGINES_ADD_CAR_ENGINE_BUTTON"),
							id: 'create_engine',
							icon: PrimeIcons.PLUS,
							command: () => this.openCarEngine(null)
						},
						...this.car.engines.map(engine => ({
							label: engine.name,
							id: `engine_${engine.id}`,
							icon: PrimeIcons.COG,
							command: () => this.openCarEngine(engine)
						}))
					],
					command: () => this.openCarEngines()
				}
			] : [])
		];
	}

	ngOnInit(): void {
		this.engineEventService.engineListChanged$.subscribe((updatedEngines) => {
			this.car.engines = updatedEngines;
			this.cdr.detectChanges();
		});

		let brandId = Number(this.route.snapshot.paramMap.get('brand'));

		this.brandService.getBrandById(brandId).subscribe({
			next: (brand) => {
				this.car.brand = brand;

				let carId = Number(this.route.snapshot.paramMap.get('carId'));

				if (carId) {
					this.carService.getCarById(carId).subscribe({
						next: (car) => {
							car.brand = brand;

							this.car = car;

							this.resolveSelectedMenuItem();
						},
						error: (e) => {
							this.navigationService.navigate([`/cars/${brand.id}/create`]);
						}
					});
				} else {
					this.resolveSelectedMenuItem();
				}
			},
			error: (e) => {
				if (e.error.code == 'car_brand_not_found') {
					this.navigationService.navigate(['brands']);
				}
			}
		});
	}

	private resolveSelectedMenuItem(): void {
		const url = this.navigationService.getCurrentUrl();

		if (url.includes('/maintenance')) {
			this.leftPanelSelectedItem = 'maintenance';
		} else if (url.includes('/engines/create')) {
			this.leftPanelSelectedItem = 'create_engine';
		} else if (url.match(/\/engines\/\d+$/)) {
			const engineId = url.match(/\/engines\/(\d+)$/)?.[1];
			this.leftPanelSelectedItem = `engine_${engineId}`;
		} else if (url.includes('/engines')) {
			this.leftPanelSelectedItem = 'all_engines';
		} else {
			this.leftPanelSelectedItem = 'settings';
		}

		this.cdr.detectChanges();
	}
}
