import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { faFacebook, faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { User } from "../../user/user";
import { ApiRequestsService } from "../../services/api-requests.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { PasswordInputComponent } from "./password-input/password-input.component";

@Component({
	selector: 'registration-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'registration.component.html',
	styleUrls: ['../login/login.component.scss']
})
export class RegistrationComponent {

	protected faFacebook = faFacebook;
	protected faGoogle = faGooglePlus;

	protected invalidEmail: boolean = false;
	protected emailExists: boolean = false;
	protected unknownError: boolean = false;
	protected passwordsNotMatch: boolean = false;

	protected success: boolean = false;

	@ViewChild('passwordInput') passwordInputComponent!: PasswordInputComponent;
	@ViewChild('passwordRepeatInput') passwordRepeatInputComponent!: PasswordInputComponent;

	protected form: FormGroup;

	private user: User;

	constructor(private userService: ApiRequestsService, private fb: FormBuilder) {
		this.user = new User();

		this.form = this.fb.group({
			email: ['', [Validators.required]],
			fullName: ['', [Validators.required]],
			password: ['', [Validators.required]],
			passwordRepeat: ['', [Validators.required]]
		});
	}

	onSubmit() {
		this.clearErrors();

		const userData = this.form.value;

		if (userData.password !== userData.passwordRepeat) {
			this.passwordsNotMatch = true;
			this.passwordRepeatInputComponent.isInvalid = true;
			return;
		}

		this.user.email = userData.email;
		this.user.fullName = userData.fullName;
		this.user.password = userData.password;

		this.userService.save(this.user).subscribe({
			next: (response) => {
				if (response.result === 'success') {
					this.success = true;

					this.form.reset();
				}
			},
			error: (e) => {
				this.onError(e.error?.code);
			}
		});
	}

	private clearErrors(): void {
		this.invalidEmail = this.emailExists = this.unknownError = this.passwordsNotMatch = this.success = false;
		this.passwordRepeatInputComponent.isInvalid = false;
	}

	private onError(errorCode: string): void {
		switch(errorCode) {
			case "invalid_email":
				this.invalidEmail = true;
				break;
			case "email_exists" :
				this.emailExists = true;
				break;
			default:
				this.unknownError = true;
		}
	}

	get passwordControl(): FormControl {
		return this.form.get('password') as FormControl;
	}

	get passwordRepeatControl(): FormControl {
		return this.form.get('passwordRepeat') as FormControl;
	}
}
