import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Car } from "../../../../../models/car.model";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { Engine } from "../../../../../models/engine.model";
import { FuelTypeService } from "../../../../../services/fuel-type.service";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { EngineService } from "../../../../../services/api/engine.service";
import { AlertComponent } from "../../../../shared/alert/alert.component";
import { EngineEventService } from "./engine/engine-event.service";
import { BootstrapButtonComponent } from "../../../../shared/button/bootstrap-button.component";

@Component({
	selector: 'engines-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'engines.component.html',
	styleUrls: ['engines.component.scss'],
	imports: [
		RouterLink,
		CommonModule,
		TranslateModule,
		ConfirmDialog,
		AlertComponent,
		BootstrapButtonComponent
	],
	standalone: true
})
export class EnginesComponent implements OnInit {

	@Input() car!: Car;

	deleteSuccess: boolean = false;

	constructor(protected fuelTypeService: FuelTypeService,
				private route: ActivatedRoute,
				private engineService: EngineService,
				private confirmationService: ConfirmationService,
				private engineEventService: EngineEventService) {

	}

	ngOnInit(): void {
		this.route.parent?.data.subscribe((data) => {
			this.car = data['car'];
		});
	}

	onDeleteEngine(engine: Engine): void {
		this.deleteSuccess = false;

		this.confirmationService.confirm({
			accept: () => {
				engine.car = this.car;

				this.engineService.deleteEngine(engine).subscribe({
					next: () => {
						const index = this.car.engines.findIndex(item => item.id === engine.id);
						if (index >= 0) {
							this.car.engines.splice(index, 1);
						}

						this.engineEventService.engineListChanged$.next(this.car.engines);

						this.deleteSuccess = true;
						window.scroll({top: 0, left: 0, behavior: 'smooth'});
					}
				});
			}
		});
	}

	get engines(): Engine[] {
		return this.car.engines || [];
	}
}
