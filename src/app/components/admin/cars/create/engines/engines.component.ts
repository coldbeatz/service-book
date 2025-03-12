import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Car } from "../../../../../models/car.model";
import { ApiRequestsService } from "../../../../../services/api-requests.service";
import { NavigationService } from "../../../../../services/navigation.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { environment } from "../../../../../../environments/environment";
import { MainComponent } from "../../../../internal/main/main.component";
import { BreadcrumbComponent } from "../../../../internal/breadcrumb/breadcrumb.component";
import { NgForOf, NgIf } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { CarService } from "../../../../../services/api/car.service";

@Component({
	selector: 'engines-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'engines.component.html',
	styleUrls: ['../car.component.scss', 'engines.component.scss'],
	imports: [
		MainComponent,
		BreadcrumbComponent,
		RouterLink,
		NgForOf,
		NgIf,
		TranslateModule
	],
	standalone: true
})
export class EnginesComponent implements OnInit {

	car: Car | null = null;

	constructor(private apiRequestsService: ApiRequestsService,
				private carService: CarService,
				private navigationService: NavigationService,
				private route: ActivatedRoute) {
	}

	ngOnInit(): void {
		this.initCar();
	}

	private initCar(): void {
		let carId = this.route.snapshot.paramMap.get('car');
		if (carId == null)
			return;

		this.carService.getCarById(Number(carId)).subscribe({
			next: (car) => {
				if (car == null) return;
				this.car = car;
			}
		});
	}

	protected readonly environment = environment;
}
