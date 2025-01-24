import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Car} from "../../../../../models/car.model";
import {ApiRequestsService} from "../../../../../services/api-requests.service";
import {NavigationService} from "../../../../../services/navigation.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../../../environments/environment";

@Component({
	selector: 'engines-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'engines.component.html',
	styleUrls: ['../create-car.component.scss', 'engines.component.scss'],
})
export class EnginesComponent implements OnInit {

	car: Car | null = null;

	constructor(private apiRequestsService: ApiRequestsService,
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

		this.apiRequestsService.getCarById(Number(carId)).subscribe({
			next: (car) => {
				if (car == null) return;
				this.car = car;

				console.log(car);
			}
		});
	}

	protected readonly environment = environment;
}
