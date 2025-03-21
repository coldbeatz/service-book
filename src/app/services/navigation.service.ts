import { Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	constructor(public router: Router) {

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
		this.router.navigate(commands, extras)
			.then(success => this.logNavigationStatus(commands, success))
			.catch(this.logNavigationError);
	}

	private logNavigationStatus(commands: any[], success: boolean): void {
		const statusMessage = `Navigation to "${commands}" ${success ? 'successful' : 'failed'}.`;
		console[success ? 'log' : 'warn'](statusMessage);
	}

	private logNavigationError(error: any): void {
		console.error('Error during navigation:', error);
	}
}
