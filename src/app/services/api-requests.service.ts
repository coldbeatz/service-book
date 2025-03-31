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

	public confirmUser(key: string): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/confirmation/confirm`, {
			key: key
		});
	}

	public save(user: User): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/user/register`, user);
	}
}
