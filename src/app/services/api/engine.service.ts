import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Engine } from "../../models/engine.model";
import { Car } from "../../models/car.model";

@Injectable({
	providedIn: 'root'
})
export class EngineService {

	private readonly API_URL: string = `${environment.apiUrl}/admin/engines`;

	constructor(private http: HttpClient) {

	}

	public getEnginesByCar(car: Car) {
		return this.http.get<Engine[]>(`${environment.apiUrl}/admin/engines?car=${car.id}`);
	}

	/**
	 * Отримує двигун по унікальному id
	 *
	 * @returns Observable<Engine>
	 */
	public getEngineById(engineId: number) {
		return this.http.get<Engine>(`${this.API_URL}/${engineId}`);
	}
}
