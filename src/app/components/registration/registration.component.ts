import {AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { faFacebook, faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { User } from "../../user/user";
import { ApiRequestsService } from "../../services/api-requests.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { PasswordInputComponent } from "./password-input/password-input.component";
import { ApiErrorsService } from "../../services/api-errors.service";

@Component({
	selector: 'registration-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'registration.component.html',
	styleUrls: ['../login/login.component.scss']
})
export class RegistrationComponent implements AfterViewInit {

	protected faFacebook = faFacebook;
	protected faGoogle = faGooglePlus;

	protected errorMessage: string|null = null;
	protected errorCode: string|null = null;

	protected success: boolean = false;

	@ViewChild('passwordInput') passwordInputComponent!: PasswordInputComponent;
	@ViewChild('passwordRepeatInput') passwordRepeatInputComponent!: PasswordInputComponent;

	protected form: FormGroup;

	private user: User;

	constructor(private userService: ApiRequestsService,
				private apiErrorsService: ApiErrorsService,
				private cdr: ChangeDetectorRef,
				private fb: FormBuilder) {

		this.user = new User();

		this.form = this.fb.group({
			email: ['', [Validators.required]],
			fullName: ['', [Validators.required]],
			password: ['', [Validators.required]],
			passwordRepeat: ['', [Validators.required]]
		});
	}

	onSubmit() {
		this.success = false;
		this.passwordRepeatInputComponent.isInvalid = false;

		const userData = this.form.value;

		if (userData.password !== userData.passwordRepeat) {
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
					this.errorMessage = this.errorCode = null;

					this.form.reset();
					this.cdr.detectChanges();
				}
			},
			error: (e) => {
				this.success = false;

				this.errorCode = e.error?.code;
				this.errorMessage = this.apiErrorsService.getMessage('registration', this.errorCode);
				this.cdr.detectChanges();
			}
		});
	}

	get passwordControl(): FormControl {
		return this.form.get('password') as FormControl;
	}

	get passwordRepeatControl(): FormControl {
		return this.form.get('passwordRepeat') as FormControl;
	}

	ngAfterViewInit(): void {
		this.cdr.detectChanges();
	}
}
