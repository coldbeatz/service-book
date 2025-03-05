import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CarNote } from "../../models/car-note.model";

export interface UserCarNoteRequest {

	id: number | null;
	userCarId: number;
	shortDescription: string;
	content: string;
}

@Injectable({
	providedIn: 'root'
})
export class UserCarNoteService {

	private readonly API_URL: string = `${environment.apiUrl}/user/cars/notes`;

	constructor(private http: HttpClient) {

	}

	/**
	 * Видалити нотатку про автомобіль користувача
	 *
	 * @param note Запис про автомобіль користувача
	 *
	 * @returns Observable<void>
	 */
	public deleteNote(note: CarNote): Observable<void> {
		const url = `${this.API_URL}/${note.id}`;
		return this.http.delete<void>(url);
	}

	/**
	 * Оновлює або зберігає запис про автомобіль користувача
	 *
	 * @param note Запис про автомобіль користувача
	 *
	 * @returns Observable<CarNote>
	 */
	public saveOrUpdateNote(note: CarNote): Observable<CarNote> {
		if (!note.userCar || !note.userCar.id)
			throw new Error("User car is null");

		const requestBody: UserCarNoteRequest = {
			id: note.id,
			userCarId: note.userCar?.id,
			shortDescription: note.shortDescription,
			content: note.content,
		};

		return note.id
			? this.http.put<CarNote>(`${this.API_URL}/${note.id}`, requestBody)
			: this.http.post<CarNote>(`${this.API_URL}`, requestBody);
	}
}
