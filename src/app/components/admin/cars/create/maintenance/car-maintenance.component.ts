import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { CarRegulationsMaintenanceService } from "../../../../../services/api/car-regulations-maintenance.service";
import { Car } from "../../../../../models/car.model";
import { BootstrapButtonComponent } from "../../../../shared/button/bootstrap-button.component";
import { TableModule } from "primeng/table";
import { MaintenanceTableComponent } from "../../../../shared/maintenance/maintenance-table.component";
import {
	PrimengDialogServiceComponent
} from "../../../services/primeng-dialog-service/primeng-dialog-service.component";
import { RegulationsMaintenance } from "../../../../../models/regulations-maintenance.model";
import { AlertComponent } from "../../../../internal/alert/alert.component";
import { RegulationsMaintenanceService } from "../../../../../services/api/regulations-maintenance.service";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";

enum SuccessType {
	MAINTENANCE_SAVED,
	DEFAULT_MAINTENANCES_INITIALIZED,
	ALL_MAINTENANCES_DELETED,
	MAINTENANCE_DELETED
}

@Component({
	selector: 'car-maintenance-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'car-maintenance.component.html',
	styleUrls: ['car-maintenance.component.scss'],
	imports: [
		CommonModule,
		TranslateModule,
		TableModule,
		BootstrapButtonComponent,
		MaintenanceTableComponent,
		PrimengDialogServiceComponent,
		AlertComponent,
		ConfirmDialog
	],
	standalone: true
})
export class CarMaintenanceComponent implements OnInit {

	@Input() car!: Car;

	@ViewChild('maintenanceTableComponent', { static: false })
	maintenanceTableComponent!: MaintenanceTableComponent;

	@ViewChild(PrimengDialogServiceComponent) modalComponent!: PrimengDialogServiceComponent;

	protected readonly SuccessType = SuccessType;
	successType: SuccessType | null = null;

	deleteAllClicked: boolean = false;

	constructor(private carRegulationsMaintenanceService: CarRegulationsMaintenanceService,
				private regulationsMaintenanceService: RegulationsMaintenanceService,
				private confirmationService: ConfirmationService) {

	}

	ngOnInit(): void {

	}

	initializeDefaultMaintenances() {
		this.carRegulationsMaintenanceService.initializeDefaultMaintenances(this.car).subscribe({
			next: maintenances => {
				this.car.maintenances = maintenances;

				this.successType = SuccessType.DEFAULT_MAINTENANCES_INITIALIZED;
				window.scroll({top: 0, left: 0, behavior: 'smooth'});
			}
		});
	}

	clearMaintenances() {
		this.deleteAllClicked = true;

		this.confirmationService.confirm({
			accept: () => {
				this.carRegulationsMaintenanceService.deleteAll(this.car).subscribe({
					next: () => {
						this.deleteAllClicked = false;

						this.car.maintenances = [];

						this.successType = SuccessType.ALL_MAINTENANCES_DELETED;
						window.scroll({top: 0, left: 0, behavior: 'smooth'});
					}
				});
			}
		});
	}

	handleMaintenanceSaved(maintenance: RegulationsMaintenance) {
		this.maintenanceTableComponent.handleMaintenanceSaved(maintenance);

		this.successType = SuccessType.MAINTENANCE_SAVED;
		window.scroll({top: 0, left: 0, behavior: 'smooth'});
	}

	handleMaintenanceDeleted(maintenance: RegulationsMaintenance) {
		this.regulationsMaintenanceService.deleteRegulationsMaintenance(maintenance).subscribe({
			next: () => {
				this.maintenanceTableComponent.handleMaintenanceDeleted(maintenance);

				this.successType = SuccessType.MAINTENANCE_DELETED;
				window.scroll({top: 0, left: 0, behavior: 'smooth'});
			}
		});
	}

	onClickEditMaintenance(maintenance: RegulationsMaintenance | null) {
		if (this.modalComponent) {
			this.modalComponent.maintenance = maintenance;
			this.modalComponent.openModal();
		}
	}
}
