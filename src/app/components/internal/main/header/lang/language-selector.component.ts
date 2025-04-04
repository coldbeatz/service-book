import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { LanguageService } from "../../../../../services/language.service";

export interface LanguageItem {
	text: string;
	resource: string;
	code: string;
}

@Component({
	selector: 'header-language-selector',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'language-selector.component.html',
	styleUrls: ['language-selector.component.scss'],
	imports: [
		TranslateModule,
		CommonModule
	],
	standalone: true
})
export class LanguageSelectorComponent implements OnInit {

	protected selectedLanguage?: LanguageItem;

	protected languages: LanguageItem[] = [
		{
			text: 'English',
			resource: 'https://resources.carsservicebook.com/country-flags/svg/us.svg',
			code: 'en'
		},
		{
			text: 'Українська',
			resource: 'https://resources.carsservicebook.com/country-flags/svg/ua.svg',
			code: 'ua'
		}
	];

	constructor(private languageService: LanguageService) {

	}

	ngOnInit(): void {
		let currentLanguage: LanguageItem | undefined =
			this.languages.find(language => language.code === this.languageService.language);

		if (!currentLanguage) {
			currentLanguage = this.languages[0];
		}

		this.selectedLanguage = currentLanguage;
	}

	switchLanguage(lang: LanguageItem) {
		this.selectedLanguage = lang;

		this.languageService.language = lang.code;
	}
}
