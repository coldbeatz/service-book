import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../user/user";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { Brand } from "../models/brand.model";
import { Country } from "../models/country.model";

@Injectable()
export class ApiRequestsService {

	constructor(private http: HttpClient, private cookieService: CookieService) {

	}

	private getToken(): string {
		return this.cookieService.get('token');
	}

	private getEmail(): string {
		return this.cookieService.get('email');
	}

	public editBrand(brand: Brand, file: File | null): Observable<any> {
		const formData = new FormData();

		formData.append('id', brand.id.toString());
		formData.append('brand', brand.brand);

		if (file) {
			formData.append('file', file);
		}

		if (brand.country != null) {
			formData.append('countryId', brand.country.id.toString());
		}

		return this.http.post<any>(`${environment.apiUrl}/admin/brands/edit`, formData);
	}

	public createBrand(brand: string, country: Country | null, file: File): Observable<any> {
		const formData = new FormData();

		formData.append('brand', brand);
		formData.append('file', file);

		if (country != null) {
			formData.append('countryId', country.id.toString());
		}

		return this.http.post<any>(`${environment.apiUrl}/admin/brands/create`, formData);
	}

	public getCountries(): Observable<any> {
		return this.http.get<Country[]>(`${environment.apiUrl}/admin/brands/countries`);
	}

	public getBrandById(id: number): Observable<any> {
		return this.http.get<Brand>(`${environment.apiUrl}/admin/brands/find/${id}`);
	}

	public getBrands(): Observable<any> {
		return this.http.get<Brand[]>(`${environment.apiUrl}/admin/brands/all`);
	}

	public tokenValidation() {
		return this.http.post<any>(`${environment.apiUrl}/login/validation`, {
			email: this.getEmail(),
			token: this.getToken()
		});
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
