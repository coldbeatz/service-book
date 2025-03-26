import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../../user/user";

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private readonly API_URL: string = `${environment.apiUrl}/user`;

	constructor(private http: HttpClient) {

	}

	public getUser(): Observable<User> {
		return this.http.get<User>(`${this.API_URL}/me`);
	}
}
