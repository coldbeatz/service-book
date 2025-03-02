import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Country } from "../../models/country.model";

@Injectable({
	providedIn: 'root'
})
export class CountryService {

	private readonly API_URL: string = `${environment.apiUrl}/admin/countries`;

	constructor(private http: HttpClient) {

	}

	/**
	 * Отримує список країн
	 *
	 * @returns Observable<Country[]>
	 */
	public getCountries(): Observable<Country[]> {
		return this.http.get<Country[]>(this.API_URL);
	}
}
