import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Car } from "../../models/car.model";
import { RegulationsMaintenance } from "../../models/regulations-maintenance.model";
import { Localized } from "../../models/localized.model";
import { CarTransmissionType } from "../../models/car-transmission-type.model";
import { FuelType } from "../../models/fuel-type.model";
import { RegulationsMaintenanceTask } from "../../models/regulations-maintenance-task.model";

export interface RegulationsMaintenanceRequest {

	workDescription: Localized;
	useDefault: boolean;
	transmissions: CarTransmissionType[];
	fuelTypes: FuelType[];
	tasks: RegulationsMaintenanceTask[];

	carId: number | null;
}

@Injectable({
	providedIn: 'root'
})
export class CarRegulationsMaintenanceService {

	private readonly API_URL: string = `${environment.apiUrl}/cars`;

	constructor(private http: HttpClient) {

	}

	public initializeDefaultMaintenances(car: Car): Observable<RegulationsMaintenance[]> {
		const url = `${this.API_URL}/${car.id}/maintenance/default`;

		return this.http.get<RegulationsMaintenance[]>(url);
	}

	public deleteAll(car: Car): Observable<void> {
		const url = `${this.API_URL}/${car.id}/maintenance`;
		return this.http.delete<void>(url);
	}
}
