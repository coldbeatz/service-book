import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class RestoreService {

	private readonly API_URL: string = `${environment.apiUrl}/restore`;

	constructor(private http: HttpClient) {

	}

	public checkKey(key: string): Observable<any> {
		return this.http.post<any>(`${this.API_URL}/key`, {
			key: key
		});
	}

	public setPassword(key: string, password: string): Observable<any> {
		return this.http.post<any>(`${this.API_URL}/password`, {
			key: key,
			password: password
		});
	}

	public restore(email: string): Observable<any> {
		return this.http.post<any>(`${this.API_URL}`, {
			email: email
		});
	}
}
