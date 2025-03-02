import { Injectable } from "@angular/core";
import { LocalizationHandlers } from "../../models/localization/localization-handlers";
import { Localization } from "../../models/localization/localization.model";
import { Localized } from "../../models/localized.model";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
	providedIn: 'root'
})
export class LocalizationService {

	defaultLanguage: Localization = Localization.UA;

	languages: Map<string, Localization>;

	constructor(private translate: TranslateService) {
		this.languages = new Map([
			["en", Localization.EN],
			["ua", Localization.UA]
		]);
	}

	get currentLanguage(): string {
		return this.translate.currentLang;
	}

	getLocalizedString(localized: Localized): string {
		let language: Localization | undefined = this.languages.get(this.currentLanguage);
		if (language == undefined)
			language = this.defaultLanguage;

		return LocalizationHandlers[language].getValue(localized);
	}
}
