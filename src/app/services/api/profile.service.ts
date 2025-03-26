import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export interface SettingsResponse {
	/**
	 * Чи було надіслано лист на пошту для підтвердження нового e-mail
	 */
	emailConfirmationSent: boolean;

	/**
	 * Чи були змінені дані користувача (пароль, ім'я, або інші дані)
	 */
	userUpdated: boolean;

	/**
	 * Токен авторизації (якщо пароль користувача був оновлений)
	 */
	token?: string;
}

export interface SettingsRequest {

	email: string;
	fullName: string;
	enableEmailNewsletter: boolean;
	currentPassword: string | null;
	newPassword: string | null;
}

@Injectable({
	providedIn: 'root'
})
export class ProfileService {

	private readonly API_URL: string = `${environment.apiUrl}/user/profile`;

	constructor(private http: HttpClient) {

	}

	/**
	 * Оновлює налаштування користувача
	 *
	 * @param settings Налаштування користувача
	 *
	 * @returns Observable<SettingsResponse>
	 */
	public updateUserSettings(settings: SettingsRequest): Observable<SettingsResponse>  {
		return this.http.put<any>(this.API_URL, settings);
	}
}
