import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { TableModule } from "primeng/table";
import { MaintenanceTableComponent } from "../../../../shared/maintenance/maintenance-table.component";
import { UserCar } from "../../../../../models/user-car.model";
import { ActivatedRoute } from "@angular/router";
import { RegulationsMaintenance } from "../../../../../models/regulations-maintenance.model";
import { RegulationsMaintenanceService } from "../../../../../services/api/regulations-maintenance.service";
import { environment } from "../../../../../../environments/environment";
import { NavigationService } from "../../../../../services/navigation.service";

@Component({
	selector: 'user-car-maintenance-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'user-car-maintenance.component.html',
	styleUrls: ['user-car-maintenance.component.scss'],
	imports: [
		CommonModule,
		TranslateModule,
		TableModule,
		MaintenanceTableComponent
	],
	standalone: true
})
export class UserCarMaintenanceComponent implements OnInit {

	@Input() userCar!: UserCar;

	maintenances: RegulationsMaintenance[] = [];
	defaultMaintenances: boolean = false;

	constructor(private route: ActivatedRoute,
				private regulationsMaintenanceService: RegulationsMaintenanceService,
				private navigationService: NavigationService) {

	}

	ngOnInit(): void {
		this.route.parent?.data.subscribe(data => {
			this.userCar = data['userCar'];

			if (!this.userCar.id) {
				this.navigationService.navigate(['user-cars']);
			}

			if (this.userCar.car) {
				if (this.userCar.car.maintenances.length > 0) {
					this.maintenances = this.userCar.car.maintenances;
				}
			}

			if (this.maintenances.length == 0) {
				this.regulationsMaintenanceService.getRegulationsMaintenance().subscribe({
					next: maintenances => {
						this.maintenances = maintenances;
						this.defaultMaintenances = true;
					}
				})
			}
		});
	}

	protected readonly environment = environment;
}
