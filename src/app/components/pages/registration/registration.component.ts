import {AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { faFacebook, faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { PasswordInputComponent } from "../../shared/password-input/password-input.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MainComponent } from "../../internal/main/main.component";
import { UserRegistrationRequest, UserService } from "../../../services/api/user.service";
import { environment } from "../../../../environments/environment";
import { LanguageLinkPipe } from "../../../services/language-link.pipe";

@Component({
	selector: 'registration-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'registration.component.html',
	styleUrls: ['../login/login.component.scss'],
    imports: [
        ReactiveFormsModule,
        FaIconComponent,
        PasswordInputComponent,
        RouterLink,
        TranslateModule,
        MainComponent,
        CommonModule,
        LanguageLinkPipe
    ],
	standalone: true
})
export class RegistrationComponent implements AfterViewInit {

	protected faFacebook = faFacebook;
	protected faGoogle = faGooglePlus;

	protected errorCode: string | null = null;
	protected success: boolean = false;

	@ViewChild('passwordInput') passwordInputComponent!: PasswordInputComponent;
	@ViewChild('passwordRepeatInput') passwordRepeatInputComponent!: PasswordInputComponent;

	protected form: FormGroup;

	constructor(private userService: UserService,
				private cdr: ChangeDetectorRef,
				private fb: FormBuilder) {

		this.form = this.fb.group({
			email: ['', [Validators.required]],
			fullName: ['', [Validators.required]],
			password: ['', [Validators.required]],
			passwordRepeat: ['', [Validators.required]]
		});
	}

	onSubmit() {
		this.errorCode = null;
		this.success = false;

		this.passwordRepeatInputComponent.isInvalid = false;

		const userData = this.form.value;

		if (userData.password !== userData.passwordRepeat) {
			this.passwordRepeatInputComponent.isInvalid = true;
			return;
		}

		const request: UserRegistrationRequest = {
			email: userData.email,
			fullName: userData.fullName,
			password: userData.password
		}

		this.userService.register(request).subscribe({
			next: (response) => {
				if (response.result === 'success') {
					this.success = true;

					this.form.reset();
					this.cdr.detectChanges();
				}
			},
			error: (e) => {
				this.success = false;
				this.errorCode = e.error?.error;

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

    protected readonly environment = environment;
}
