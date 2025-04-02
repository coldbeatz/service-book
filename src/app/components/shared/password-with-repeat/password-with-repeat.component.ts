import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	Input, OnChanges,
	OnInit, SimpleChanges,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { PasswordInputComponent } from "../password-input/password-input.component";

@Component({
	selector: 'password-with-repeat-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'password-with-repeat.component.html',
	styleUrls: ['password-with-repeat.component.scss'],
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule,
		PasswordInputComponent,
		ReactiveFormsModule
	],
	standalone: true
})
export class PasswordWithRepeatComponent implements AfterViewInit, OnInit, OnChanges {

	@ViewChild('currentPasswordInput') currentPasswordInputComponent?: PasswordInputComponent;
	@ViewChild('passwordInput') passwordInputComponent!: PasswordInputComponent;
	@ViewChild('passwordRepeatInput') passwordRepeatInputComponent!: PasswordInputComponent;

	/**
	 * Може використовуватись при зміні даних користувача
	 */
	@Input() useFieldCurrentPassword: boolean = false;

	@Input() passwordRequired: boolean = true;

	protected form: FormGroup;

	constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
		this.form = this.fb.group({
			password: ['', [Validators.required]],
			passwordRepeat: ['', [Validators.required]]
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['useFieldCurrentPassword'] && changes['useFieldCurrentPassword'].currentValue) {
			this.form.addControl('currentPassword', new FormControl('', [Validators.required]));
		}
	}

	ngOnInit(): void {
		if (this.useFieldCurrentPassword) {
			this.form.addControl('currentPassword', new FormControl('', [Validators.required]));
		}
	}

	ngAfterViewInit(): void {
		this.cdr.detectChanges();
	}

	public clear(): void {
		this.form.reset();
	}

	get passwordControl(): FormControl {
		return this.form.get('password') as FormControl;
	}

	get passwordRepeatControl(): FormControl {
		return this.form.get('passwordRepeat') as FormControl;
	}

	get currentPasswordControl(): FormControl | null {
		return this.form.get('currentPassword') as FormControl;
	}

	validationPasswords(): boolean {
		this.passwordInputComponent.isInvalid = this.passwordRepeatInputComponent.isInvalid = false;

		if (this.currentPasswordInputComponent) {
			this.currentPasswordInputComponent.isInvalid = false;

			// Введено поточний пароль користувача і не введено новий пароль
			if (this.currentPassword && !this.password) {
				this.passwordInputComponent.isInvalid = true;
				return false;
			}

			// Введено новий пароль і не введено поточний пароль
			if (!this.currentPassword && this.password) {
				this.currentPasswordInputComponent.isInvalid = true;
				return false;
			}
		} else {
			// Не введено пароль
			if (this.passwordRequired && !this.password) {
				this.passwordInputComponent.isInvalid = true;
				return false;
			}
		}

		if (this.password) {
			if (this.password !== this.repeatPassword) {
				this.passwordRepeatInputComponent.isInvalid = true;
				return false;
			}
		}

		return true;
	}

	get password(): string {
		return this.passwordControl.value;
	}

	private get repeatPassword(): string {
		return this.passwordRepeatControl.value;
	}

	get currentPassword(): string | null {
		return this.useFieldCurrentPassword ? this.currentPasswordControl?.value : null;
	}
}
