import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ApiRequestsService } from "../../../services/api-requests.service";
import { Button } from 'primeng/button';
import { MainComponent } from "../../internal/main/main.component";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Table, TableModule } from "primeng/table";
import { RegulationsMaintenance } from "../../../models/regulations-maintenance.model";
import { CommonModule } from "@angular/common";
import { ButtonGroup } from "primeng/buttongroup";
import { PrimengDialogServiceComponent } from "./primeng-dialog-service/primeng-dialog-service.component";
import { MaintenanceWorkType } from "../../../models/maintenance-work-type.model";
import { RegulationsMaintenanceTask } from "../../../models/regulations-maintenance-task.model";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { MessageService } from "primeng/api";
import { Toast } from "primeng/toast";

@Component({
	selector: 'services-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'services.component.html',
	styleUrls: ['services.component.scss'],
	imports: [
		CommonModule,
		MainComponent,
		BreadcrumbComponent,
		Button,
		ButtonGroup,
		TranslateModule,
		TableModule,
		PrimengDialogServiceComponent,
		IconField,
		InputIcon,
		InputText,
		Toast
	],
	standalone: true
})
export class ServicesComponent implements OnInit {

	/**
	 * Список всіх об'єктів регламентного обслуговування
	 */
	regulationsMaintenance: RegulationsMaintenance[] = [];

	mileageColumns: { value: number; label: string }[] = [];

	mileageSuffix: string = "";

	@ViewChild(PrimengDialogServiceComponent) modalComponent!: PrimengDialogServiceComponent;

	constructor(private apiRequestsService: ApiRequestsService,
				private translateService: TranslateService,
				private messageService: MessageService) {

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

		this.apiRequestsService.getRegulationsMaintenance().subscribe({
			next: (regulationsMaintenance) => {
				this.regulationsMaintenance = regulationsMaintenance;
				this.buildMileageColumns();
			}
		});
	}

	onClickEditMaintenance(item: RegulationsMaintenance | null) {
		if (this.modalComponent) {
			this.modalComponent.maintenance = item;
			this.modalComponent.openModal();
		}
	}

	handleMaintenanceSaved(updatedMaintenance: RegulationsMaintenance) {
		const index = this.regulationsMaintenance.findIndex(item => item.id === updatedMaintenance.id);
		if (index >= 0) {
			this.regulationsMaintenance[index] = updatedMaintenance;
		} else {
			this.regulationsMaintenance.push(updatedMaintenance);
		}

		const summary = this.translateService.instant('TOAST_SUCCESS');
		const detail = this.translateService.instant('TOAST_SUCCESS_DETAIL');

		this.messageService.add({ severity: 'info', summary: summary, detail: detail });

		this.buildMileageColumns();
	}

	protected readonly MaintenanceWorkType = MaintenanceWorkType;

	@ViewChild('dt') dt!: Table;

	onFilterInput($event: Event): void {
		const target = $event.target as HTMLInputElement | null;

		if (target) {
			this.dt.filterGlobal(target.value, 'contains');
		}
	}
}
