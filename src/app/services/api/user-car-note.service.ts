import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CarNote } from "../../models/car-note.model";
import { UserCar } from "../../models/user-car.model";

export interface UserCarNoteRequest {

	id: number | null;
	shortDescription: string;
	content: string;
}

@Injectable({
	providedIn: 'root'
})
export class UserCarNoteService {

	private readonly API_URL: string = `${environment.apiUrl}/user/cars/`;

	constructor(private http: HttpClient) {

	}

	/**
	 * Отримує записи користувача по його автомобілю
	 *
	 * @returns Observable<CarNote[]>
	 */
	public getNotes(userCar: UserCar): Observable<CarNote[]> {
		const url = `${this.API_URL}${userCar.id}/notes`;

		return this.http.get<CarNote[]>(url);
	}

	public getNoteById(noteId: number, userCarId: number): Observable<CarNote> {
		const url = `${this.API_URL}${userCarId}/notes/${noteId}`;

		return this.http.get<CarNote>(url);
	}

	/**
	 * Видалити нотатку про автомобіль користувача
	 *
	 * @param note Запис про автомобіль користувача
	 *
	 * @returns Observable<void>
	 */
	public deleteNote(note: CarNote): Observable<void> {
		const url = `${this.API_URL}${note.userCar?.id}/notes/${note.id}`;

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
			shortDescription: note.shortDescription,
			content: note.content,
		};

		const url = `${this.API_URL}${note.userCar?.id}/notes`;

		return note.id
			? this.http.put<CarNote>(`${url}/${note.id}`, requestBody)
			: this.http.post<CarNote>(url, requestBody);
	}
}
