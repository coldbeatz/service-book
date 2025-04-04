import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../../models/user";

export interface UserRegistrationRequest {
	email: string;
	fullName: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	email: string;
	token: string;
}

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private readonly API_URL: string = `${environment.apiUrl}/user`;

	constructor(private http: HttpClient) {

	}

	/**
	 * Отримання авторизованого користувача
	 */
	public getUser(): Observable<User> {
		return this.http.get<User>(`${this.API_URL}/me`);
	}

	/**
	 * Реєстрація користувача
	 */
	public register(request: UserRegistrationRequest): Observable<any> {
		return this.http.post<any>(`${this.API_URL}/register`, request);
	}

	/**
	 * Вхід користувача (автентифікація по email + пароль)
	 */
	public login(request: LoginRequest): Observable<LoginResponse> {
		return this.http.post<any>(`${this.API_URL}/login`, request);
	}

	/**
	 * Валідація JWT токена (для перевірки збереженої сесії)
	 */
	public tokenValidation(email: string | null, token: string | null) {
		return this.http.post<any>(`${this.API_URL}/token/validation`, {
			email: email,
			token: token
		});
	}
}
