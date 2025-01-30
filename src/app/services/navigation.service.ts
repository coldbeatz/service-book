import { Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	constructor(private router: Router) {

	}

	public navigate(path: string, extras: NavigationExtras = {}) {
		this.router.navigate([path], extras)
			.then(success => this.logNavigationStatus(path, success))
			.catch(this.logNavigationError);
	}

	private logNavigationStatus(path: string, success: boolean): void {
		const statusMessage = `Navigation to "${path}" ${success ? 'successful' : 'failed'}.`;
		console[success ? 'log' : 'warn'](statusMessage);
	}

	private logNavigationError(error: any): void {
		console.error('Error during navigation:', error);
	}
}
