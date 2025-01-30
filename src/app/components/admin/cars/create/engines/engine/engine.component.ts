import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ApiRequestsService } from "../../../../../../services/api-requests.service";
import { NavigationService } from "../../../../../../services/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { Car } from "../../../../../../models/car.model";
import { Engine } from "../../../../../../models/engine.model";
import { MainComponent } from "../../../../../internal/main/main.component";
import { BreadcrumbComponent } from "../../../../../internal/breadcrumb/breadcrumb.component";
import { NgForOf } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@Component({
	selector: 'engine-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'engine.component.html',
	styleUrls: ['../../create-car.component.scss', 'engine.component.scss'],
	imports: [
		MainComponent,
		BreadcrumbComponent,
		ReactiveFormsModule,
		NgForOf,
		TranslateModule
	],
	standalone: true
})
export class EngineComponent implements OnInit {

	protected form: FormGroup;

	car: Car | null = null;
	engine: Engine | null = null;

	availableFuelTypes: string[] = [];

	constructor(private apiRequestsService: ApiRequestsService,
				private fb: FormBuilder,
				private navigationService: NavigationService,
				private route: ActivatedRoute) {

		this.form = this.fb.group({
			name: ['', []],
			displacement: ['0.1', [Validators.required]],
			fuelType: ['', [Validators.required]],
			horsepower: ['0', [Validators.required]]
		});
	}

	ngOnInit(): void {
		this.initCar();
		this.initEngine();

		this.apiRequestsService.getAvailableFuelTypes().subscribe({
			next: (availableFuelTypes) => {
				this.availableFuelTypes = availableFuelTypes;
			}
		});
	}

	private initEngine(): void {
		let engineId = this.route.snapshot.paramMap.get('engine');
		if (engineId == null)
			return;

		this.apiRequestsService.getEngineById(Number(engineId)).subscribe({
			next: (engine) => {
				this.form.patchValue({
					name: engine.name,
					displacement: engine.displacement,
					fuelType: engine.fuelType,
					horsepower: engine.horsepower,
				});

				this.engine = engine;
			}
		});
	}

	private initCar(): void {
		let carId = this.route.snapshot.paramMap.get('car');
		if (carId == null)
			return;

		this.apiRequestsService.getCarById(Number(carId)).subscribe({
			next: (car) => {
				this.car = car;
			}
		});
	}

	onSubmit() {
		if (this.car == null)
			return;

		const data = this.form.value;

		if (this.engine != null) {
			this.engine.name = data.name;
			this.engine.displacement = data.displacement;
			this.engine.fuelType = data.fuelType;
			this.engine.horsepower = data.horsepower;

			this.apiRequestsService.updateEngine(this.engine).subscribe({
				next: (engine) => {
					this.navigationService.navigate(`/cars/${this.car?.brand?.id}/${this.car?.id}/engines`);
				}
			});
		} else {
			this.apiRequestsService.createEngine(this.car, data.name, data.displacement, data.fuelType,
												 data.horsepower).subscribe({
				next: (engine) => {
					this.navigationService.navigate(`/cars/${this.car?.brand?.id}/${this.car?.id}/engines`);
				}
			});
		}
	}
}
