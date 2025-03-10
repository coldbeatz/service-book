import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { Button } from 'primeng/button';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Table, TableModule } from "primeng/table";
import { RegulationsMaintenance } from "../../../models/regulations-maintenance.model";
import { CommonModule } from "@angular/common";
import { ButtonGroup } from "primeng/buttongroup";
import { MaintenanceWorkType } from "../../../models/maintenance-work-type.model";
import { RegulationsMaintenanceTask } from "../../../models/regulations-maintenance-task.model";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialog } from "primeng/confirmdialog";

@Component({
	selector: 'maintenance-table',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'maintenance-table.component.html',
	styleUrls: ['maintenance-table.component.scss'],
	imports: [
		CommonModule,
		Button,
		ButtonGroup,
		TranslateModule,
		TableModule,
		IconField,
		InputIcon,
		InputText,
		ConfirmDialog
	],
	standalone: true
})
export class MaintenanceTableComponent implements OnInit, OnChanges {

	/**
	 * Список всіх об'єктів регламентного обслуговування
	 */
	@Input() regulationsMaintenance!: RegulationsMaintenance[];

	@Output() maintenanceEdited: EventEmitter<RegulationsMaintenance> = new EventEmitter();
	@Output() maintenanceDeleted: EventEmitter<RegulationsMaintenance> = new EventEmitter();

	mileageColumns: { value: number; label: string }[] = [];

	mileageSuffix: string = "";

	deleteClicked: boolean = false;

	constructor(private translateService: TranslateService,
				private confirmationService: ConfirmationService) {

	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['regulationsMaintenance'] && changes['regulationsMaintenance'].currentValue) {
			setTimeout(() => {
				this.buildMileageColumns();
			});
		}
	}

	buildMileageColumns(): void {
		const mileageSet = new Set<number>();

		for (const maintenance of this.regulationsMaintenance) {
			for (const task of maintenance.tasks) {
				if (task.specificMileage > 0) {
					mileageSet.add(task.specificMileage);
				}
				if (task.interval > 0) {
					for (let i = task.interval; i <= 100_000; i += task.interval) {
						mileageSet.add(i);
					}
				}
			}
		}

		const sortedMileages = Array.from(mileageSet).sort((a, b) => a - b);

		this.mileageColumns = sortedMileages.map(value => ({
			value,
			label: this.formatMileage(value)
		}));
	}

	formatMileage(value: number): string {
		return (value / 1000).toLocaleString() + this.mileageSuffix;
	}

	getWorkTypesAtMileage(maintenance: RegulationsMaintenance, mileage: number): MaintenanceWorkType|null {
		let selectedTask: RegulationsMaintenanceTask | null = null;

		for (const task of maintenance.tasks) {
			const interval = task.interval;
			const specificMileage = task.specificMileage;

			if (specificMileage === mileage || (interval > 0 && mileage % interval === 0)) {
				// Немає вибраного завдання або поточне має більший інтервал
				if (!selectedTask || interval > selectedTask.interval) {
					selectedTask = task;
				}
			}
		}

		// Знайшли завдання, повертаємо його тип роботи
		return selectedTask ? selectedTask.workType : null;
	}

	ngOnInit(): void {
		this.translateService.get("MAINTENANCE_TABLE_MILEAGE_THOUSANDS").subscribe(value => {
			this.mileageSuffix = value;
		});
	}

	onClickEditMaintenance(item: RegulationsMaintenance | null) {
		if (item) {
			this.maintenanceEdited.emit(item);
		}
	}

	handleMaintenanceSaved(updatedMaintenance: RegulationsMaintenance) {
		const index = this.regulationsMaintenance.findIndex(item => item.id === updatedMaintenance.id);
		if (index >= 0) {
			this.regulationsMaintenance[index] = updatedMaintenance;
		} else {
			this.regulationsMaintenance.push(updatedMaintenance);
		}

		this.buildMileageColumns();
	}

	handleMaintenanceDeleted(maintenance: RegulationsMaintenance) {
		this.deleteClicked = false;

		const index = this.regulationsMaintenance.findIndex(item => item.id === maintenance.id);
		if (index >= 0) {
			this.regulationsMaintenance.splice(index, 1);
			this.buildMileageColumns();
		}
	}

	protected readonly MaintenanceWorkType = MaintenanceWorkType;

	@ViewChild('dt') dt!: Table;

	onFilterInput($event: Event): void {
		const target = $event.target as HTMLInputElement | null;

		if (target) {
			this.dt.filterGlobal(target.value, 'contains');
		}
	}

	onClickDeleteMaintenance(maintenance: RegulationsMaintenance) {
		this.confirmationService.confirm({
			accept: () => {
				this.deleteClicked = true;
				this.maintenanceDeleted.emit(maintenance);
			}
		});
	}
}
