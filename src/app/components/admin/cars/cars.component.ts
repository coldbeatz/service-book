import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Brand } from "../../../models/brand.model";
import { ApiRequestsService } from "../../../services/api-requests.service";
import { NavigationService } from "../../../services/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { Car } from "../../../models/car.model";

@Component({
	selector: 'cars-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'cars.component.html',
	styleUrls: ['cars.component.scss'],
})
export class CarsComponent implements OnInit {

	brand: Brand | null = null;
	cars: Car[] = [];

	currentYear: number;

	constructor(private apiRequestsService: ApiRequestsService,
				private navigationService: NavigationService,
				private route: ActivatedRoute) {

		this.currentYear = new Date().getFullYear();
	}

	ngOnInit(): void {
		let id = this.route.snapshot.paramMap.get('id');

		this.apiRequestsService.getBrandById(Number(id)).subscribe({
			next: (brand) => {
				this.brand = brand;

				this.apiRequestsService.getCarsByBrand(brand).subscribe({
					next: (cars) => {
						this.cars = cars;
						console.log(cars);
					}
				});
			},
			error: (e) => {
				if (e.error.code == 'car_brand_not_found') {
					this.navigationService.navigate('brands');
				}
			}
		});
	}

	protected readonly environment = environment;
}
