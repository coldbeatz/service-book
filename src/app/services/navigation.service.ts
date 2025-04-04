import { Injectable, Injector } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { LanguageService } from "./language.service";

@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	private languageService!: LanguageService;

	constructor(private router: Router, private injector: Injector) {
		setTimeout(() => {
			this.languageService = this.injector.get(LanguageService);
		});
	}

	public createUrl(commands: any[]): string {
		return Array.isArray(commands) ? commands.join('/') : commands;
	}

	getCurrentUrl(): string {
		return this.router.url;
	}

	public updateUrlIfChanged(commands: any[], extras: NavigationExtras = {}): void {
		const newUrl = this.router.createUrlTree(commands, extras).toString();
		if (this.router.url !== newUrl) {
			this.navigate(commands, { ...extras, skipLocationChange: false, replaceUrl: false });
		}
	}

	public navigate(commands: any[], extras: NavigationExtras = {}) {
		const lang = this.languageService.language;

		const segments = commands[0] === lang ? commands : [lang, ...commands];

		this.router.navigate(segments, extras)
			.then(success => this.logNavigationStatus(segments, success))
			.catch(this.logNavigationError);
	}

	private logNavigationStatus(commands: any[], success: boolean): void {
		const statusMessage = `Navigation to "${commands}" ${success ? 'successful' : 'failed'}.`;
		console[success ? 'log' : 'warn'](statusMessage);
	}

	private logNavigationError(error: any): void {
		console.error(error);
	}
}
