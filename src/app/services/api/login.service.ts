import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface LoginResponse {
	email: string;
	token: string;
}

@Injectable({
	providedIn: 'root'
})
export class LoginService {

	private readonly API_URL: string = `${environment.apiUrl}/login`;

	constructor(private http: HttpClient) {

	}

	/**
	 * Вхід користувача (автентифікація по email + пароль)
	 */
	public login(email: string, password: string): Observable<LoginResponse> {
		return this.http.post<any>(this.API_URL, {
			email: email,
			password: password
		});
	}

	/**
	 * Валідація JWT токена (для перевірки збереженої сесії)
	 */
	public tokenValidation(email: string | null, token: string | null) {
		return this.http.post<any>(`${this.API_URL}/validation`, {
			email: email,
			token: token
		});
	}
}
