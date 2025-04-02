import { Component, ViewEncapsulation } from '@angular/core';
import { faFacebook, faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MainComponent } from "../../internal/main/main.component";
import { PasswordInputComponent } from "../../shared/password-input/password-input.component";
import { LoginRequest, LoginResponse, UserService } from "../../../services/api/user.service";
import { environment } from '../../../../environments/environment';

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

	protected environment = environment;

	constructor(private userService: UserService,
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

		const request: LoginRequest = {
			email: data.email,
			password: data.password
		}

		this.userService.login(request).subscribe({
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
