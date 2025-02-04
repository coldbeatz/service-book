import { Injectable } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { ApiRequestsService } from "./api-requests.service";
import { lastValueFrom } from "rxjs";
import { NavigationService } from "./navigation.service";

@Injectable({
	providedIn: 'root',
})
export class AuthService {

	private isLoggedIn = false;

	constructor(private cookieService: CookieService,
				private apiRequestsService: ApiRequestsService,
				private navigationService: NavigationService) {

	}

	getToken(): string | null {
		return this.cookieService.get('token');
	}

	public async isAuthenticated(): Promise<boolean> {
		if (this.isLoggedIn)
			return true;

		try {
			const response = await lastValueFrom(this.apiRequestsService.tokenValidation());

			this.isLoggedIn = response.result === 'success';
		} catch (error) {
			this.isLoggedIn = false;
		}

		return this.isLoggedIn;
	}

	public login(email: string, token: string): void {
		this.setCookie('email', email);
		this.setCookie('token', token);

		this.isLoggedIn = true;

		this.navigationService.navigate(['brands']);
	}

	public logout(): void {
		this.cookieService.delete('token');
		this.cookieService.delete('email');

		this.isLoggedIn = false;

		this.navigationService.navigate(['login']);
	}

	private setCookie(name: string, value: string): void {
		this.cookieService.set(name, value, {
			expires: 30,
			secure: true,
			sameSite: 'Lax'
		});
	}
}
