import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Button } from 'primeng/button';
import { MainComponent } from "../../internal/main/main.component";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { TranslateModule } from "@ngx-translate/core";
import { TableModule } from "primeng/table";
import { RegulationsMaintenance } from "../../../models/regulations-maintenance.model";
import { CommonModule } from "@angular/common";
import { ButtonGroup } from "primeng/buttongroup";
import { PrimengDialogServiceComponent } from "./primeng-dialog-service/primeng-dialog-service.component";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { Toast } from "primeng/toast";
import { RegulationsMaintenanceService } from "../../../services/api/regulations-maintenance.service";
import { MaintenanceTableComponent } from "../../shared/maintenance/maintenance-table.component";

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
		MaintenanceTableComponent
	],
	standalone: true
})
export class ServicesComponent implements OnInit {

	/**
	 * Список всіх об'єктів регламентного обслуговування
	 */
	regulationsMaintenance: RegulationsMaintenance[] = [];

	constructor(private regulationsMaintenanceService: RegulationsMaintenanceService) {

	}

	ngOnInit(): void {
		this.regulationsMaintenanceService.getRegulationsMaintenance().subscribe({
			next: (regulationsMaintenance) => {
				this.regulationsMaintenance = regulationsMaintenance;
			}
		});
	}
}
