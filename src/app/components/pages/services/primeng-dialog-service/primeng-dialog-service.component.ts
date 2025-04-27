import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AutosizeModule } from "ngx-autosize";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegulationsMaintenance } from "../../../../models/regulations-maintenance.model";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Dialog, DialogModule } from "primeng/dialog";
import { PrimeTemplate } from "primeng/api";
import { InputSwitch } from "primeng/inputswitch";
import { Button } from "primeng/button";
import { MultiSelect } from "primeng/multiselect";
import { FloatLabel } from "primeng/floatlabel";
import { Textarea } from "primeng/textarea";
import { MaintenanceWorkType } from "../../../../models/maintenance-work-type.model";
import { PrimengDialogServiceTaskComponent } from "./primeng-dialog-service-task/primeng-dialog-service-task.component";
import { CarTransmissionType } from "../../../../models/car-transmission-type.model";
import { FuelType } from "../../../../models/fuel-type.model";
import { RegulationsMaintenanceTask } from "../../../../models/regulations-maintenance-task.model";
import { cloneDeep } from "lodash";
import { RegulationsMaintenanceService } from "../../../../services/api/regulations-maintenance.service";
import { Car } from "../../../../models/car.model";

@Component({
	selector: 'primeng-dialog-service-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'primeng-dialog-service.component.html',
	styleUrls: ['primeng-dialog-service.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		AutosizeModule,
		ReactiveFormsModule,
		FormsModule,
		TranslateModule,
		Dialog,
		PrimeTemplate,
		InputSwitch,
		Button,
		DialogModule,
		MultiSelect,
		FloatLabel,
		Textarea,
		PrimengDialogServiceTaskComponent
	]
})
export class PrimengDialogServiceComponent implements OnInit {

	availableTransmissions: { value: CarTransmissionType; label: string } [] = [];
	availableFuelTypes: { value: FuelType; label: string } [] = [];

	private _maintenance!: RegulationsMaintenance;

	@Input()
	public car?: Car;

	@Input()
	set maintenance(value: RegulationsMaintenance | null) {
		if (value) {
			// Клонуємо, щоб під час редагування об'єкта не змінювались дані в таблиці без збереження
			this._maintenance = cloneDeep(value);

			if (this.maintenance.tasks.length === 0) {
				this.addTask();
			}
		} else {
			this.maintenance = new RegulationsMaintenance();
		}
	}

	get maintenance(): RegulationsMaintenance {
		return this._maintenance;
	}

	displayModal: boolean = false;

	@Output() maintenanceSaved: EventEmitter<RegulationsMaintenance> = new EventEmitter();

	constructor(private regulationsMaintenanceService: RegulationsMaintenanceService,
				private translateService: TranslateService) {

		this.maintenance = new RegulationsMaintenance();
	}

	addTask() {
		this.maintenance.tasks.push({
			id: 0,
			interval: 0,
			specificMileage: 0,
			workType: MaintenanceWorkType.INSPECTION
		});
	}

	openModal() {
		this.displayModal = true;
	}

	closeModal() {
		this.displayModal = false;
	}

	private initAvailableTransmissions(): void {
		const enumKeys = Object.keys(CarTransmissionType)
			.filter(key => isNaN(Number(key)) && key !== "OTHER");

		const translationKeys = enumKeys.map(key => `TRANSMISSION_${key}`);

		this.translateService.get(translationKeys).subscribe((translations: { [key: string]: string }) => {
			this.availableTransmissions = enumKeys.map(key => ({
				value: CarTransmissionType[key as keyof typeof CarTransmissionType],
				label: translations[`TRANSMISSION_${key}`]
			}));
		});
	}

	private initAvailableFuelTypes(): void {
		const enumKeys = Object.keys(FuelType)
			.filter(key => isNaN(Number(key)) && key !== "OTHER");

		const translationKeys = enumKeys.map(key => `FUEL_TYPE_${key}`);

		this.translateService.get(translationKeys).subscribe((translations: { [key: string]: string }) => {
			this.availableFuelTypes = enumKeys.map(key => ({
				value: FuelType[key as keyof typeof FuelType],
				label: translations[`FUEL_TYPE_${key}`]
			}));
		});
	}

	ngOnInit(): void {
		this.initAvailableTransmissions();
		this.initAvailableFuelTypes();
	}

	onSaveChangesClick() {
		if (this.maintenance) {
			if (this.car) {
				this.maintenance.carId = this.car.id;
			}

			this.regulationsMaintenanceService.saveOrUpdateRegulationsMaintenance(this.maintenance).subscribe({
				next: (maintenance) => {
					this.maintenanceSaved.emit(maintenance);
					this.closeModal();
				}
			});
		}
	}

	onDeleteTask(task: RegulationsMaintenanceTask) {
		if (this.maintenance.tasks.length > 1) {
			this.maintenance.tasks = this.maintenance.tasks.filter(t => t !== task);
		} else {
			task.id = task.specificMileage = task.interval = 0;
			task.workType = MaintenanceWorkType.INSPECTION;
		}
	}
}
