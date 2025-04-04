import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { TranslateModule } from "@ngx-translate/core";
import { RegulationsMaintenance } from "../../../models/regulations-maintenance.model";
import { CommonModule } from "@angular/common";
import { PrimengDialogServiceComponent } from "./primeng-dialog-service/primeng-dialog-service.component";
import { RegulationsMaintenanceService } from "../../../services/api/regulations-maintenance.service";
import { MaintenanceTableComponent } from "../../shared/maintenance/maintenance-table.component";
import { ConfirmDialog } from "primeng/confirmdialog";
import { AlertComponent } from "../../shared/alert/alert.component";
import { LeftPanelComponent } from "../../shared/left-panel/left-panel.component";
import { MenuItem } from "primeng/api";
import { BootstrapButtonComponent } from "../../shared/button/bootstrap-button.component";
import { MainComponent } from "../../shared/main/main.component";

enum SuccessType {
	MAINTENANCE_SAVED,
	MAINTENANCE_DELETED
}

@Component({
	selector: 'services-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'services.component.html',
	styleUrls: ['services.component.scss'],
	imports: [
		CommonModule,
		MainComponent,
		BreadcrumbComponent,
		TranslateModule,
		MaintenanceTableComponent,
		PrimengDialogServiceComponent,
		AlertComponent,
		LeftPanelComponent,
		BootstrapButtonComponent,
		ConfirmDialog
	],
	standalone: true
})
export class ServicesComponent implements OnInit {

	@ViewChild('maintenanceTableComponent', { static: false })
	maintenanceTableComponent!: MaintenanceTableComponent;

	@ViewChild(PrimengDialogServiceComponent) modalComponent!: PrimengDialogServiceComponent;

	protected readonly SuccessType = SuccessType;
	successType: SuccessType | null = null;

	/**
	 * Список всіх об'єктів регламентного обслуговування
	 */
	regulationsMaintenance: RegulationsMaintenance[] = [];

	menuItems: MenuItem[] = [];

	constructor(private regulationsMaintenanceService: RegulationsMaintenanceService) {

	}

	ngOnInit(): void {
		this.regulationsMaintenanceService.getRegulationsMaintenance().subscribe({
			next: (regulationsMaintenance) => {
				this.regulationsMaintenance = regulationsMaintenance;
			}
		});
	}

	onClickEditMaintenance(maintenance: RegulationsMaintenance | null) {
		if (this.modalComponent) {
			this.modalComponent.maintenance = maintenance;
			this.modalComponent.openModal();
		}
	}

	handleMaintenanceDeleted(maintenance: RegulationsMaintenance) {
		console.log(123);
		this.regulationsMaintenanceService.deleteRegulationsMaintenance(maintenance).subscribe({
			next: () => {
				this.maintenanceTableComponent.handleMaintenanceDeleted(maintenance);

				this.successType = SuccessType.MAINTENANCE_DELETED;
				window.scroll({top: 0, left: 0, behavior: 'smooth'});
			}
		});
	}

	handleMaintenanceSaved(maintenance: RegulationsMaintenance) {
		this.maintenanceTableComponent.handleMaintenanceSaved(maintenance);

		this.successType = SuccessType.MAINTENANCE_SAVED;
		window.scroll({top: 0, left: 0, behavior: 'smooth'});
	}
}
