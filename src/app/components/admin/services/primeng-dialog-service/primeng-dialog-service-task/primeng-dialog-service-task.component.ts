import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { InputNumber } from "primeng/inputnumber";
import { SelectButton } from "primeng/selectbutton";
import { MaintenanceWorkType } from "../../../../../models/maintenance-work-type.model";
import { RegulationsMaintenanceTask } from "../../../../../models/regulations-maintenance-task.model";
import { FormsModule } from "@angular/forms";

@Component({
	selector: 'primeng-dialog-service-task-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'primeng-dialog-service-task.component.html',
	standalone: true,
	imports: [
		SelectButton,
		TranslateModule,
		InputNumber,
		FormsModule
	]
})
export class PrimengDialogServiceTaskComponent implements OnInit {

	stateOptions: { label: string; value: MaintenanceWorkType } [] = [];

	@Input() task!: RegulationsMaintenanceTask;

	constructor(private translateService: TranslateService) {

	}

	ngOnInit(): void {
		const translationKeys = Object.keys(MaintenanceWorkType)
			.filter(key => isNaN(Number(key)))
			.map(key => 'MAINTENANCE_WORK_TYPE_' + key);

		// Якщо переклади гарантовано завантажені
		const translations = this.translateService.instant(translationKeys);

		this.stateOptions = Object.keys(MaintenanceWorkType)
			.filter(key => isNaN(Number(key)))
			.map(key => ({
				label: translations['MAINTENANCE_WORK_TYPE_' + key],
				value: MaintenanceWorkType[key as keyof typeof MaintenanceWorkType]
			}));
	}
}
