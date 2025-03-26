import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Brand } from "../../models/brand.model";

export interface BrandOption {
	value: Brand;
	label: string;
}

@Injectable({
	providedIn: 'root'
})
export class BrandService {

	private readonly API_URL: string = `${environment.apiUrl}/brands`;

	constructor(private http: HttpClient) {

	}

	public getCarsCountByBrand(brand: Brand): Observable<{ count: number }> {
		return this.http.get<{ count: number }>(`${this.API_URL}/${brand.id}/cars/count`);
	}

	/**
	 * Оновлює або зберігає марку автомобілей
	 *
	 * @param brand Марка автомобіля
	 * @param file Фото марки
	 *
	 * @returns Observable<Brand>
	 */
	public saveOrUpdateBrand(brand: Brand, file: File | null): Observable<Brand> {
		const formData = new FormData();

		formData.append('brand', brand.brand);

		file && formData.append('imageFile', file);
		brand.country && formData.append('countryId', brand.country.id.toString());

		if (brand.country) {
			formData.append('countryId', brand.country.id.toString());
		}

		const url = this.API_URL;

		return brand.id && brand.id !== 0
			? this.http.put<Brand>(`${url}/${brand.id}`, formData)
			: this.http.post<Brand>(url, formData);
	}

	/**
	 * Отримує марку автомобілей за ідентифікатором
	 *
	 * @returns Observable<Brand>
	 */
	public getBrandById(id: number): Observable<Brand> {
		return this.http.get<Brand>(`${this.API_URL}/${id}`);
	}

	/**
	 * Отримує список марок автомобілей
	 *
	 * @returns Observable<Brand[]>
	 */
	public getBrands(): Observable<Brand[]> {
		return this.http.get<Brand[]>(`${this.API_URL}`);
	}
}
