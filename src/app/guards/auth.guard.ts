import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavigationService } from "../services/navigation.service";

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {

	constructor(private authService: AuthService, private navigationService: NavigationService) {

	}

	async canActivate(): Promise<boolean> {
		const authenticated = await this.authService.isAuthenticated();

		if (authenticated) {
			return true;
		}

		this.navigationService.navigate(['login']);
		return false;
	}
}
