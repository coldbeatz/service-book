import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserCar } from "../../../../models/user-car.model";
import { UserCarService } from "../../../../services/api/user-car.service";
import { NavigationService } from "../../../../services/navigation.service";

@Injectable({
	providedIn: 'root'
})
export class UserCarResolver implements Resolve<UserCar> {

	constructor(private userCarService: UserCarService, private navigationService: NavigationService) {

	}

	resolve(route: ActivatedRouteSnapshot): Observable<UserCar> {
		const userCarId = Number(route.paramMap.get('userCarId'));

		if (userCarId) {
			return this.userCarService.getUserCarById(userCarId).pipe(
				catchError(() => {
					this.navigationService.navigate(['/user-cars']);
					return of(new UserCar());
				})
			);
		} else {
			return of(new UserCar());
		}
	}
}
