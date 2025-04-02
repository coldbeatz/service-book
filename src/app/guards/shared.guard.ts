import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class SharedGuard implements CanActivate {

	constructor(private authService: AuthService) {

	}

	async canActivate(): Promise<boolean> {
		await this.authService.isAuthenticated();
		return true
	}
}
