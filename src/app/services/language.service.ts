import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, first } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class LanguageService {

	private readonly storageKey = 'language';

	constructor(private translate: TranslateService,
				private router: Router) {

		this.translate.addLangs(['en', 'ua']);
		this.translate.defaultLang = 'en';
	}

	initializeLanguage(): void {
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			first() // беремо тільки першу завершену навігацію
		).subscribe(() => {
			const availableLanguages = this.translate.getLangs();

			const urlLang = this.router.url.split('/')[1];

			if (availableLanguages.includes(urlLang)) {
				// якщо мова в URL підтримується
				this.language = urlLang;
			} else {
				const storedLang = localStorage.getItem(this.storageKey);

				if (storedLang && availableLanguages.includes(storedLang)) {
					this.translate.use(storedLang);
				} else {
					this.language = this.translate.defaultLang;
				}
			}
		});
	}

	public get language(): string {
		return this.translate.currentLang || this.translate.defaultLang;
	}

	public set language(lang: string) {
		if (this.translate.getLangs().includes(lang)) {
			this.translate.use(lang);

			localStorage.setItem(this.storageKey, lang);

			// Отримуємо поточний URL та замінюємо lang
			const currentUrl = this.router.url.split('/');
			if (currentUrl.length > 1 && this.translate.getLangs().includes(currentUrl[1])) {
				currentUrl[1] = lang;
			} else {
				currentUrl.unshift(lang);
			}

			this.router.navigateByUrl(currentUrl.join('/'));
		} else {
			console.warn(`Unsupported language "${lang}"`);
		}
	}

	// простий метод для генерації routerLink
	public link(...segments: string[]): any[] {
		return ['/', this.language, ...segments];
	}
}
