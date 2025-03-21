import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Car } from "../../../../models/car.model";
import { CarService } from "../../../../services/api/car.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CarResolver implements Resolve<Car> {

	constructor(private carService: CarService, private route: ActivatedRoute) {

	}

	resolve(route: ActivatedRouteSnapshot): Observable<Car> {
		const carId = Number(route.paramMap.get('carId'));
		return this.carService.getCarById(carId);
	}
}
