import { Component, ViewEncapsulation } from '@angular/core';
import { faFacebook, faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ApiRequestsService } from "../../services/api-requests.service";
import { ApiErrorsService } from "../../services/api-errors.service";
import { AuthService } from "../../services/auth.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
	selector: 'login-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.scss'],
	imports: [
		ReactiveFormsModule,
		FaIconComponent,
		NgIf,
		RouterLink,
		TranslateModule
	],
	standalone: true
})
export class LoginComponent {

	faFacebook = faFacebook;
	faGoogle = faGooglePlus;

	protected form: FormGroup;

	protected errorMessage: string|null = null;

	constructor(private apiRequestsService: ApiRequestsService,
				private apiErrorsService: ApiErrorsService,
				private authService: AuthService,
				private fb: FormBuilder) {

		this.form = this.fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});
	}

	onSubmit() {
		const data = this.form.value;

		this.apiRequestsService.login(data.email, data.password).subscribe({
			next: (response) => {
				let token = response.token;

				if (token != null) {
					this.errorMessage = null;

					this.authService.login(data.email, token);
				}
			},
			error: (e) => {
				let errorCode = e.error?.code;
				this.errorMessage = this.apiErrorsService.getMessage('login', errorCode);
			}
		});
	}
}
