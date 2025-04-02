import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

export interface ConfirmationRequest {
	key: string;
}

@Injectable({
	providedIn: 'root'
})
export class ConfirmationService {

	private readonly API_URL: string = `${environment.apiUrl}/user/confirmation`;

	constructor(private http: HttpClient) {

	}

	public confirmUser(key: string): Observable<any> {
		const request: ConfirmationRequest = {
			key: key
		}

		return this.http.post<any>(this.API_URL, request);
	}
}
