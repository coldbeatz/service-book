import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

/**
 * @deprecated
 */
@Injectable({
	providedIn: 'root'
})
export class ApiErrorsService {

	private readonly unknownErrorKey: string = 'UNKNOWN_ERROR';

	private readonly codes: Record<string, Record<string, string>> = {
		confirmation: {
			key_is_missing: 'CONFIRMATION_KEY_IS_MISSING'
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
