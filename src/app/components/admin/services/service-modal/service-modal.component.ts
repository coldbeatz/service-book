import {Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ApiRequestsService } from "../../../../services/api-requests.service";
import { NgForOf, NgIf } from "@angular/common";
import { AutosizeModule } from "ngx-autosize";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegulationsMaintenance } from "../../../../models/regulations-maintenance.model";
import { map, Subject, takeUntil } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";

@Component({
	selector: 'service-modal-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'service-modal.component.html',
	styleUrls: ['service-modal.component.scss'],
	standalone: true,
	imports: [
		NgForOf,
		AutosizeModule,
		ReactiveFormsModule,
		FormsModule,
		TranslateModule
	]
})
export class ServiceModalComponent implements OnInit, OnDestroy {

	private destroy$ = new Subject<void>();

	availableTransmissions: string[] = [];
	availableFuelTypes: string[] = [];

	maintenanceData: RegulationsMaintenance = {
		id: 0,
		workDescription: {
			en: '',
			ua: ''
		},
		interval: 0,
		specificMileage: 0,
		useDefault: false,
		transmissions: [],
		fuelTypes: []
	};

	constructor(private apiRequestsService: ApiRequestsService) {

	}

	ngOnInit(): void {
		this.apiRequestsService.getTransmissions()
			.pipe(
				map(transmissions => transmissions.filter(t => t !== "OTHER")),
				takeUntil(this.destroy$)
			)
			.subscribe(transmissions => this.availableTransmissions = transmissions);

		this.apiRequestsService.getAvailableFuelTypes()
			.pipe(
				map(fuelTypes => fuelTypes.filter(f => f !== "OTHER")),
				takeUntil(this.destroy$)
			)
			.subscribe(fuelTypes => this.availableFuelTypes = fuelTypes);
	}

	onSaveChangesClick() {
		this.apiRequestsService.saveOrUpdateRegulationsMaintenance(this.maintenanceData).subscribe({
			next: (maintenance) => {
				console.log(maintenance);
			}
		});
	}

	onClickFuelType(fuelType: string) {
		const index = this.maintenanceData.fuelTypes.indexOf(fuelType);
		if (index === -1) {
			this.maintenanceData.fuelTypes.push(fuelType);
		} else {
			this.maintenanceData.fuelTypes.splice(index, 1);
		}
	}

	onClickTransmission(transmission: string) {
		const index = this.maintenanceData.transmissions.indexOf(transmission);
		if (index === -1) {
			this.maintenanceData.transmissions.push(transmission);
		} else {
			this.maintenanceData.transmissions.splice(index, 1);
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
