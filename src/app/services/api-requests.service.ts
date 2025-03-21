import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../user/user";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

/**
 * @deprecated
 */
@Injectable({
	providedIn: 'root'
})
export class ApiRequestsService {

	constructor(private http: HttpClient) {

	}

	public getUser(): Observable<User> {
		return this.http.get<User>(`${environment.apiUrl}/user/me`);
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
