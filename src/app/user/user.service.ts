import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "./user";
import { environment } from "../../environments/environment";

@Injectable()
export class UserService {

	constructor(private http: HttpClient) {

	}

	public save(user: User) {
		return this.http.post<User>(`${environment.apiUrl}/user/register`, user).subscribe(
			response => {
				console.log('User saved successfully:', response);
			},
			error => {
				console.error('Error saving user:', error);
			}
		);
	}
}
