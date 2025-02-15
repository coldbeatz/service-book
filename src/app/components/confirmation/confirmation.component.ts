import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ApiErrorsService } from "../../services/api-errors.service";
import { ApiRequestsService } from "../../services/api-requests.service";
import { NgIf } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService } from "../../services/auth.service";

@Component({
	selector: 'confirmation-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'confirmation.component.html',
	imports: [
		NgIf,
		RouterLink,
		TranslateModule
	],
	standalone: true
})
export class ConfirmationComponent implements OnInit {

	protected activationSuccess: boolean = false;

	protected errorMessage: string|null = null;

	constructor(private route: ActivatedRoute,
				private apiRequestsService: ApiRequestsService,
				private apiErrorsService: ApiErrorsService,
				private authService: AuthService) {

	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			const key = params.get('key');

			if (key != null) {
				this.activation(key);
			}
		});
	}

	private activation(key: string) {
		this.apiRequestsService.confirmUser(key).subscribe({
			next: (response) => {
				console.log(response);

				const { token, email } = response;

				if (token && email) {
					this.errorMessage = null;
					this.activationSuccess = true;

					this.authService.updateAuthData(email, token);
				}
			},
			error: (e) => {
				this.activationSuccess = false;

				this.errorMessage = this.apiErrorsService.getMessage('confirmation', e.error?.code);
			}
		});
	}
}
