import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CarTransmissionType } from "../../models/car-transmission-type.model";
import { UserCar } from "../../models/user-car.model";
import { FuelType } from "../../models/fuel-type.model";
import { CarNote } from "../../models/car-note.model";

@Injectable({
	providedIn: 'root'
})
export class UserCarService {

	private readonly API_URL: string = `${environment.apiUrl}/user/cars`;

	constructor(private http: HttpClient) {

	}

	/**
	 * Видалити автомобіль користувача
	 *
	 * @param userCar Автомобіль користувача
	 *
	 * @returns Observable<void>
	 */
	public deleteUserCar(userCar: UserCar): Observable<void> {
		const url = `${this.API_URL}/${userCar.id}`;
		return this.http.delete<void>(url);
	}

	/**
	 * Отримує список автомобілів користувача
	 *
	 * @returns Observable<UserCar[]>
	 */
	public getUserCars(): Observable<UserCar[]> {
		return this.http.get<UserCar[]>(`${this.API_URL}`);
	}

	/**
	 * Отримує автомобіль користувача по його унікальному id
	 *
	 * @param id Унікальний ідентифікатор автомобіля
	 *
	 * @returns Observable<UserCar>
	 */
	public getUserCarById(id: number): Observable<UserCar> {
		return this.http.get<UserCar>(`${this.API_URL}/${id}`);
	}

	/**
	 * Оновлює або зберігає автомобіль користувача
	 *
	 * @param userCar Автомобіль користувача
	 * @param file Зображення автомобіля
	 *
	 * @returns Observable<UserCar>
	 */
	public saveOrUpdateUserCar(userCar: UserCar, file: File | null): Observable<UserCar> {
		if (!userCar.car) throw new Error("Car is null");
		if (userCar.fuelType == null) throw new Error("Fuel type is null");
		if (userCar.transmissionType == null) throw new Error("Transmission type is null");

		const formData = new FormData();

		formData.append('carId', userCar.car.id.toString());

		userCar.engine && formData.append('engineId', userCar.engine.id.toString());
		userCar.vehicleYear && formData.append('vehicleYear', userCar.vehicleYear.toString());

		formData.append('vinCode', userCar.vinCode);
		formData.append('licensePlate', userCar.licensePlate);
		formData.append('transmissionType', CarTransmissionType[userCar.transmissionType]);
		formData.append('fuelType', FuelType[userCar.fuelType]);
		formData.append('vehicleMileage', userCar.vehicleMileage.toString());

		file && formData.append('file', file);

		return userCar.id
			? this.http.put<UserCar>(`${this.API_URL}/${userCar.id}`, formData)
			: this.http.post<UserCar>(`${this.API_URL}`, formData);
	}
}
