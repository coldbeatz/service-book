import { Component, inject } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { RouterOutlet } from "@angular/router";
import { LanguageService } from "./services/language.service";

@Component({
	selector: 'app-root',
	template: '<router-outlet></router-outlet>',
	imports: [
		RouterOutlet
	],
	standalone: true
})
export class AppComponent {

	private languageService = inject(LanguageService);

	constructor() {
		this.languageService.initializeLanguage();
	}
}
