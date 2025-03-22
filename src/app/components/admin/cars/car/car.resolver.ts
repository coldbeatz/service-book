import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Car } from "../../../../models/car.model";
import { CarService } from "../../../../services/api/car.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { NavigationService } from "../../../../services/navigation.service";

@Injectable({ providedIn: 'root' })
export class CarResolver implements Resolve<Car> {

	constructor(private carService: CarService, private navigationService: NavigationService) {

	}

	resolve(route: ActivatedRouteSnapshot): Observable<Car> {
		const carId = Number(route.paramMap.get('carId'));

		if (carId) {
			return this.carService.getCarById(carId).pipe(
				catchError(() => {
					this.navigationService.navigate(['/brands']);
					return of(new Car());
				})
			);
		} else {
			return of(new Car());
		}
	}
}
