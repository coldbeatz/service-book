import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Confirmation } from "./confirmation";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class ConfirmationService {

	constructor(private http: HttpClient, private router: Router) {

	}

	public confirm(confirmation: Confirmation) {
		return this.http.post<Confirmation>(`${environment.apiUrl}/confirmation/confirm`, confirmation).subscribe(
			response => {
				console.log('Confirmation successfully:', response);
			},
			error => {
				if (error.error.message === 'key_is_missing') {
					this.router.navigate(['/login']).then(success => {
						if (success) {
							console.log('Navigation to login successful');
						} else {
							console.error('Navigation to login failed');
						}
					})
					.catch(error => {
						console.error('Error during navigation:', error);
					});
				}
			}
		);
	}
}
