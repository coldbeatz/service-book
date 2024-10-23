import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "./user";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class UserService {

	constructor(private http: HttpClient) {

	}

	public restore(email: string): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/user/restore`, email);
	}

	public save(user: User): Observable<any> {
		return this.http.post<any>(`${environment.apiUrl}/user/register`, user);
	}
}
