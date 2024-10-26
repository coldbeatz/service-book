import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiRequestsService } from "../../../services/api-requests.service";
import { PasswordInputComponent } from "../../registration/password-input/password-input.component";
import { ActivatedRoute } from "@angular/router";
import { ApiErrorsService } from "../../../services/api-errors.service";

@Component({
	selector: 'change-password-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'change-password.component.html'
})
export class ChangePasswordComponent implements AfterViewInit, OnInit {

	protected form: FormGroup;

	protected success: boolean = false;

	protected errorMessage: string|null = null;
	protected errorCode: string|null = null;

	private key!: string;

	@ViewChild('passwordInput') passwordInputComponent!: PasswordInputComponent;
	@ViewChild('passwordRepeatInput') passwordRepeatInputComponent!: PasswordInputComponent;

	constructor(private userService: ApiRequestsService,
				private apiErrorsService: ApiErrorsService,
				private fb: FormBuilder,
				private cdr: ChangeDetectorRef,
				private route: ActivatedRoute) {

		this.form = this.fb.group({
			password: ['', [Validators.required]],
			passwordRepeat: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			let key = params.get('key');

			if (key != null) {
				this.key = key;
			}

			this.userService.restoreCheckKey(this.key).subscribe({
				next: (response) => {
					if (response.result === 'success') {
						this.cdr.detectChanges();
					}
				},
				error: (e) => {
					this.errorCode = e.error?.code;
					this.errorMessage = this.apiErrorsService.getMessage('restore', this.errorCode);

					this.cdr.detectChanges();
				}
			});
		});
	}

	onSubmit() {
		const value = this.form.value;

		if (value.password !== value.passwordRepeat) {
			this.passwordRepeatInputComponent.isInvalid = true;
			return;
		}

		this.passwordRepeatInputComponent.isInvalid = false;

		this.userService.restoreSetPassword(this.key, value.password).subscribe({
			next: (response) => {
				if (response.result === 'success') {
					this.errorCode = this.errorMessage = null;
					this.success = true;

					this.form.reset();
					this.cdr.detectChanges();
				}
			},
			error: (e) => {
				this.success = false;

				this.errorCode = e.error?.code;
				this.errorMessage = this.apiErrorsService.getMessage('restore', this.errorCode);

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
