import { Component, ViewEncapsulation } from '@angular/core';
import { faFacebook, faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MainComponent } from "../../internal/main/main.component";
import { LoginResponse, LoginService } from "../../../services/api/login.service";
import { PasswordInputComponent } from "../../shared/password-input/password-input.component";

@Component({
	selector: 'login-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.scss'],
	imports: [
		ReactiveFormsModule,
		FaIconComponent,
		CommonModule,
		RouterLink,
		TranslateModule,
		MainComponent,
		PasswordInputComponent
	],
	standalone: true
})
export class LoginComponent {

	faFacebook = faFacebook;
	faGoogle = faGooglePlus;

	protected form: FormGroup;

	protected errorCode: string | null = null;

	constructor(private loginService: LoginService,
				private authService: AuthService,
				private fb: FormBuilder) {

		this.form = this.fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]],
			remember: [true]
		});
	}

	get passwordControl(): FormControl {
		return this.form.get('password') as FormControl;
	}

	onSubmit() {
		this.errorCode = null;

		const data = this.form.value;

		this.loginService.login(data.email, data.password).subscribe({
			next: (response: LoginResponse) => {
				let token = response.token;

				if (token != null) {
					this.authService.login(response.email, token, data.remember);
				}
			},
			error: (e) => {
				this.errorCode = e.error?.error;
			}
		});
	}
}
