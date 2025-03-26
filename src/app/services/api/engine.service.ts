import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Engine } from "../../models/engine.model";
import { Car } from "../../models/car.model";
import { Observable } from "rxjs";
import { FuelType } from "../../models/fuel-type.model";

export interface EngineRequest {

	name: string;
	displacement: number;
	horsepower: number;
	fuelType: FuelType;
}

@Injectable({
	providedIn: 'root'
})
export class EngineService {

	private readonly API_URL: string = `${environment.apiUrl}/cars/`;

	constructor(private http: HttpClient) {

	}

	/**
	 * Оновлює або зберігає двигун автомобіля
	 *
	 * @param engine Двигун автомобіля
	 *
	 * @returns Observable<Engine>
	 */
	public saveOrUpdateEngine(engine: Engine): Observable<Engine> {
		if (!engine.car)
			throw new Error("Car is null!");


		const request: EngineRequest = {
			name: engine.name,
			displacement: engine.displacement,
			fuelType: engine.fuelType,
			horsepower: engine.horsepower
		}

		const url = `${this.API_URL}${engine.car.id}/engines`;

		return engine.id
			? this.http.put<Engine>(`${url}/${engine.id}`, request)
			: this.http.post<Engine>(url, request);
	}

	/**
	 * Видалити двигун автомобіля
	 *
	 * @param engine Двигун автомобіля
	 *
	 * @returns Observable<void>
	 */
	public deleteEngine(engine: Engine): Observable<void> {
		const url = `${this.API_URL}${engine.car.id}/engines/${engine.id}`;
		return this.http.delete<void>(url);
	}

	/**
	 * Отримує двигун по унікальному id
	 *
	 * @returns Observable<Engine>
	 */
	//public getEngineById(engineId: number) {
	//	return this.http.get<Engine>(`${this.API_URL}/${engineId}`);
	//}
}
