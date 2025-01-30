import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
	providedIn: 'root'
})
export class ApiErrorsService {

	private readonly unknownErrorKey: string = 'UNKNOWN_ERROR';

	private readonly codes: Record<string, Record<string, string>> = {
		confirmation: {
			key_is_missing: 'CONFIRMATION_KEY_IS_MISSING'
		},
		registration: {
			invalid_email: 'REGISTRATION_ERROR_EMAIL_INVALID',
			email_exists: 'REGISTRATION_ERROR_EMAIL_EXISTS'
		},
		restore: {
			key_is_invalid: 'RESTORE_ERROR_INVALID_KEY',
			email_not_confirmed: 'RESTORE_ERROR_EMAIL_NOT_CONFIRMED',
			email_not_registered: 'RESTORE_ERROR_EMAIL_NOT_REGISTERED',
			error_send_mail: 'SEND_MAIL_ERROR'
		},
		login: {
			incorrect_login_or_password: 'LOGIN_ERROR_INCORRECT_DATA'
		}
	};

	constructor(private translate: TranslateService) {

	}

	public getMessage(path: string, code: string|null): string {
		let key = this.unknownErrorKey;

		if (code != null) {
			key = this.codes[path]?.[code] ?? this.unknownErrorKey;
		}

		return this.translate.instant(key);
	}
}
