import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ConfirmationComponent } from "./confirmation.component";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class ConfirmationService {

	constructor(private http: HttpClient) {

	}

	public confirm(component: ConfirmationComponent): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/confirmation/confirm`, component.confirmation);
	}
}
