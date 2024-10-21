import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ConfirmationRequest } from "./confirmation.request";
import { environment } from "../../../environments/environment";
import { ConfirmationComponent } from "./confirmation.component";

@Injectable({
	providedIn: 'root'
})
export class ConfirmationService {

	constructor(private http: HttpClient) {

	}

	public confirm(component: ConfirmationComponent) {
		if (component.confirmation?.key == null)
			return;

		this.http.post<ConfirmationRequest>(`${environment.apiUrl}/confirmation/confirm`, component.confirmation).subscribe({
			next: () => {
				component.errorKey = null;
				component.activationSuccess = true;
			},
			error: (e) => {
				component.activationSuccess = false;

				if (e.error.message === 'key_is_missing') {
					component.errorKey = 'key_is_missing';
				} else {
					component.errorKey = 'unknown_error'
				}
			}
		});
	}
}
