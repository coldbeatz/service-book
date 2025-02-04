import { Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	constructor(private router: Router) {

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
