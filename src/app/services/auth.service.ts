import { Injectable } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { lastValueFrom } from "rxjs";
import { NavigationService } from "./navigation.service";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: 'root',
})
export class AuthService {

	/**
	 * Користувач натиснув на кнопку запам'ятовування при вході в систему
	 */
	private remember: boolean = false;

	private isLoggedIn = false;

	constructor(private cookieService: CookieService,
				private http: HttpClient,
				private navigationService: NavigationService) {

		// Перевіримо чи дані користувача збережено в cookie
		this.remember = !!this.cookieService.get('token');
	}

	/**
	 * Отримати токен користувача
	 */
	getToken(): string | null {
		return this.remember ? this.cookieService.get('token') : sessionStorage.getItem('token');
	}

	/**
	 * Отримати e-mail користувача
	 */
	getEmail(): string | null {
		return this.remember ? this.cookieService.get('email') : sessionStorage.getItem('email');
	}

	private tokenValidation() {
		return this.http.post<any>(`${environment.apiUrl}/login/validation`, {
			email: this.getEmail(),
			token: this.getToken()
		});
	}

	/**
	 * Перевірити, чи авторизований користувач
	 */
	public async isAuthenticated(): Promise<boolean> {
		if (this.isLoggedIn) return true;

		try {
			const response = await lastValueFrom(this.tokenValidation());
			this.isLoggedIn = response.result === 'success';
		} catch (error) {
			this.isLoggedIn = false;
		}

		return this.isLoggedIn;
	}

	public updateAuthData(email: string, token: string): void {
		this.updateEmail(email);
		this.updateToken(token);
	}

	updateEmail(email: string) {
		this.setStorage('email', email);
	}

	updateToken(token: string) {
		this.setStorage('token', token);
	}

	public login(email: string, token: string, remember: boolean): void {
		this.remember = remember;
		this.updateAuthData(email, token);

		this.isLoggedIn = true;

		this.navigationService.navigate(['brands']);
	}

	public logout(): void {
		this.cookieService.delete('token');
		this.cookieService.delete('email');

		sessionStorage.removeItem('token');
		sessionStorage.removeItem('email');

		this.isLoggedIn = false;

		this.navigationService.navigate(['login']);
	}

	/**
	 * Зберегти дані в cookies або sessionStorage в залежності від remember
	 */
	private setStorage(name: string, value: string): void {
		if (this.remember) {
			console.log("cookie", name, value);
			this.cookieService.set(name, value, {
				expires: 30,
				//secure: true,
				sameSite: 'Lax',
				path: '/'
			});
		} else {
			console.log("sessionStorage", name, value);
			sessionStorage.setItem(name, value);
		}

		console.log("Current cookies:", document.cookie);
	}
}
