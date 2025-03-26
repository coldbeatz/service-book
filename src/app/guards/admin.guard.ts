import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService, Role } from '../services/auth.service';
import { NavigationService } from "../services/navigation.service";
import { of, tap } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
	providedIn: 'root',
})
export class AdminGuard implements CanActivate {

	constructor(private authService: AuthService, private navigationService: NavigationService) {

	}

	async canActivate(): Promise<boolean> {
		const isAuthenticated = await this.authService.isAuthenticated();

		if (!isAuthenticated) {
			this.navigationService.navigate(['login']);
			return false;
		}

		return new Promise(resolve => {
			this.authService.hasRole(Role.ADMIN).pipe(
				tap(isAdmin => {
					if (!isAdmin) {
						this.navigationService.navigate(['']);
					}

					resolve(isAdmin);
				}),
				catchError(() => {
					this.navigationService.navigate(['']);
					resolve(false);
					return of(false);
				})
			).subscribe();
		});
	}
}
