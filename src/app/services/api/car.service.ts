import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Car } from "../../models/car.model";
import { Brand } from "../../models/brand.model";
import { CarTransmissionType } from "../../models/car-transmission-type.model";

export interface CarOption {
	value: Car;
	label: string;
}

@Injectable({
	providedIn: 'root'
})
export class CarService {

	private readonly API_URL: string = `${environment.apiUrl}/admin/cars`;

	constructor(private http: HttpClient) {

	}

	public deleteCar(car: Car): Observable<void> {
		const url = `${this.API_URL}/${car.id}`;
		return this.http.delete<void>(url);
	}

	/**
	 * Отримує автомобіль по його унікальному id
	 *
	 * @param id Унікальний ідентифікатор автомобіля
	 *
	 * @returns Observable<Car>
	 */
	public getCarById(id: number): Observable<Car> {
		return this.http.get<Car>(`${this.API_URL}/${id}`);
	}

	/**
	 * Отримує список автомобілів по бренду
	 *
	 * @returns Observable<Brand[]>
	 */
	public getCarsByBrand(brand: Brand): Observable<Car[]> {
		return this.http.get<Car[]>(`${this.API_URL}?brandId=${brand.id}`);
	}

	/**
	 * Оновлює або зберігає автомобіль
	 *
	 * @param car Автомобіль
	 * @param file Зображення автомобіля
	 *
	 * @returns Observable<Car>
	 */
	public saveOrUpdateCar(car: Car, file: File | null): Observable<Car> {
		if (!car.brand)
			throw new Error("Car brand is null!");

		const formData = new FormData();

		formData.append('model', car.model);
		formData.append('startYear', car.startYear.toString());

		car.endYear && formData.append('endYear', car.endYear.toString());

		file && formData.append('file', file);

		car.transmissions.forEach(transmission => {
			formData.append('transmissions', CarTransmissionType[transmission]);
		});

		return car.id
			? this.http.put<Car>(`${this.API_URL}/${car.id}`, formData)
			: this.http.post<Car>(`${this.API_URL}?brandId=${car.brand.id}`, formData);
	}
}
