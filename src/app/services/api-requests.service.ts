import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../user/user";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Car } from "../models/car.model";
import { Engine } from "../models/engine.model";

/**
 * @deprecated
 */
@Injectable({
	providedIn: 'root'
})
export class ApiRequestsService {

	constructor(private http: HttpClient) {

	}

	public updateEngine(engine: Engine): Observable<Engine | any> {
		const formData = new FormData();

		formData.append("engineId", engine.id.toString());

		if (engine.name != null && engine.name.length > 0) {
			formData.append('name', engine.name);
		}

		formData.append('displacement', engine.displacement.toString());
		formData.append('fuelType', engine.fuelType);
		formData.append('horsepower', engine.horsepower.toString());

		return this.http.post<any>(`${environment.apiUrl}/admin/engines/update`, formData);
	}

	public createEngine(car: Car, name: string, displacement: number, fuelType:
						string, horsepower: number): Observable<Engine | any> {

		const formData = new FormData();

		formData.append("carId", car.id.toString());

		if (name != null && name.length > 0) {
			formData.append('name', name);
		}

		formData.append('displacement', displacement.toString());
		formData.append('fuelType', fuelType);
		formData.append('horsepower', horsepower.toString());

		return this.http.post<any>(`${environment.apiUrl}/admin/engines/create`, formData);
	}

	public getAvailableFuelTypes(): Observable<string[]> {
		return this.http.get<any>(`${environment.apiUrl}/admin/engines/fuel_types`);
	}

	public getUser(): Observable<User> {
		return this.http.get<User>(`${environment.apiUrl}/user/me`);
	}

	public login(email: string, password: string): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/login`, {
			email: email,
			password: password
		});
	}

	public confirmUser(key: string): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/confirmation/confirm`, {
			key: key
		});
	}

	public restoreCheckKey(key: string): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/restore/checkkey`, {
			key: key
		});
	}

	public restoreSetPassword(key: string, password: string): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/restore/setpassword`, {
			key: key,
			password: password
		});
	}

	public restore(email: string): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/restore/`, {
			email: email
		});
	}

	public save(user: User): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/user/register`, user);
	}
}
