import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Car } from "../../../../../../models/car.model";
import { Engine } from "../../../../../../models/engine.model";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FuelTypeService } from "../../../../../../services/fuel-type.service";
import { FuelType } from "../../../../../../models/fuel-type.model";
import { NumberFormInputComponent } from "../../../../../shared/form/number-form-input/number-form-input.component";
import { FormInputComponent } from "../../../../../shared/form/form-input/form-input.component";
import { Select } from "primeng/select";
import { EngineService } from "../../../../../../services/api/engine.service";
import { AlertComponent } from "../../../../../internal/alert/alert.component";
import { NavigationService } from "../../../../../../services/navigation.service";
import { EngineEventService } from "./engine-event.service";

@Component({
	selector: 'engine-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'engine.component.html',
	styleUrls: ['engine.component.scss'],
	imports: [
		ReactiveFormsModule,
		CommonModule,
		TranslateModule,
		NumberFormInputComponent,
		FormsModule,
		FormInputComponent,
		Select,
		AlertComponent
	],
	standalone: true
})
export class EngineComponent implements OnInit {

	@Input() car!: Car;

	engine: Engine = this.emptyEngine();

	savedSuccess: boolean = false;

	constructor(private route: ActivatedRoute,
				private engineService: EngineService,
				protected fuelTypeService: FuelTypeService,
				private navigationService: NavigationService,
				private engineEventService: EngineEventService) {
	}

	ngOnInit(): void {
		this.route.parent?.data.subscribe((data) => {
			this.car = data['car'];

			this.route.params.subscribe(params => {
				const engineId = Number(params['engine']);
				this.engine = this.loadEngineById(engineId);
			});
		});
	}

	private loadEngineById(engineId: number): Engine {
		if (engineId) {
			const engine: Engine | undefined = this.car.engines.find(engine => engine.id === engineId);
			if (engine) {
				return engine;
			}
		}

		return this.emptyEngine();
	}

	emptyEngine(): Engine {
		return {
			id: 0,
			name: '',
			displacement: 0,
			fuelType: FuelType.PETROL,
			horsepower: 0,
			createdAt: null,
			updatedAt: null,
			car: this.car
		}
	}

	onSubmit() {
		this.savedSuccess = false;

		if (!this.engine.car) {
			this.engine.car = this.car;
		}

		this.engineService.saveOrUpdateEngine(this.engine).subscribe({
			next: (engine) => {
				this.car.engines.push(engine);

				this.engineEventService.engineListChanged$.next(this.car.engines);

				if (!this.engine.id) {
					this.navigationService.navigate([`/cars/${this.car.brand?.id}/${this.car.id}/engines`]);
				}

				this.engine = engine;
				this.savedSuccess = true;

				window.scroll({top: 0, left: 0, behavior: 'smooth'});
			}
		});
	}

	hasInvalid(): boolean {
		return !this.engine.name || this.engine.horsepower == 0 || this.engine.displacement == 0;
	}
}
