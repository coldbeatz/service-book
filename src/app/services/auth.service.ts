import { Injectable } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, interval, lastValueFrom, map, Observable, of, switchMap } from "rxjs";
import { NavigationService } from "./navigation.service";
import { HttpClient } from "@angular/common/http";
import { UserService } from "./api/user.service";
import { User } from "../user/user";
import { catchError } from "rxjs/operators";

export enum Role {
	/**
	 * Звичайний користувач
	 */
	USER = 'USER',
	/**
	 * Адміністратор
	 */
	ADMIN = 'ADMIN'
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {

	/**
	 * Користувач натиснув на кнопку запам'ятовування при вході в систему
	 */
	private remember: boolean = false;

	private isLoggedIn = false;

	private roleSubject = new BehaviorSubject<Role | null>(null);

	constructor(private cookieService: CookieService,
				private http: HttpClient,
				private navigationService: NavigationService,
				private userService: UserService) {

		// Перевіримо чи дані користувача збережено в cookie
		this.remember = !!this.cookieService.get('token');

		this.initRolePolling();
	}

	public isLogin(): boolean {
		return this.isLoggedIn;
	}

	private initRolePolling(): void {
		interval(10000)
			.pipe(
				switchMap(() => this.userService.getUser()),
				catchError(() => of(null))
			)
			.subscribe((user: User | null) => {
				if (user) {
					this.roleSubject.next(user.role);
				}
			});
	}

	private decodeToken(): any {
		const token = this.getToken();

		if (!token) return null;

		try {
			const payload = token.split('.')[1];
			return JSON.parse(atob(payload));
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	public hasRole(role: Role): Observable<boolean> {
		return this.roleSubject.pipe(
			switchMap(currentRole => {
				if (currentRole !== null) {
					return of(currentRole === role);
				} else {
					return this.userService.getUser().pipe(
						map(user => {
							this.roleSubject.next(user.role);
							return user.role === role;
						}),
						catchError(() => of(false))
					);
				}
			})
		);
	}

	/*getRole(): Role | null {
		const decoded = this.decodeToken();

		if (!decoded || !decoded.role)
			return null;

		const rolesMap: Record<string, Role> = {
			ADMIN: Role.ADMIN,
			USER: Role.USER,
		};

		return rolesMap[decoded.role] || null;
	}*/

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

	/**
	 * Перевірити, чи авторизований користувач
	 */
	public async isAuthenticated(): Promise<boolean> {
		if (this.isLoggedIn) return true;

		try {
			const response = await lastValueFrom(
				this.userService.tokenValidation(this.getEmail(), this.getToken())
			);

			if (response.result === 'token_valid') {
				this.isLoggedIn = true;
			}
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

		this.navigationService.navigate(['/']);
	}

	public logout(): void {
		this.cookieService.delete('token', '/');
		this.cookieService.delete('email', '/');

		sessionStorage.removeItem('token');
		sessionStorage.removeItem('email');

		this.isLoggedIn = false;

		console.log(sessionStorage.getItem('token'), this.cookieService.get('token'));
		this.navigationService.navigate(['login']);
	}

	/**
	 * Зберегти дані в cookies або sessionStorage в залежності від remember
	 */
	private setStorage(name: string, value: string): void {
		if (this.remember) {
			this.cookieService.set(name, value, {
				expires: 30,
				//secure: true,
				sameSite: 'Lax',
				path: '/'
			});
		} else {
			sessionStorage.setItem(name, value);
		}
	}
}
