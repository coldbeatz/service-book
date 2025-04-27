import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { PasswordInputComponent } from "../../../shared/password-input/password-input.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import { CommonModule, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import { RestoreService } from "../../../../services/api/restore.service";
import { LanguageLinkPipe } from "../../../../pipes/language-link.pipe";
import { MainComponent } from "../../../shared/main/main.component";

@Component({
	selector: 'change-password-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'change-password.component.html',
	imports: [
		ReactiveFormsModule,
		RouterLink,
		PasswordInputComponent,
		TranslateModule,
		CommonModule,
		LanguageLinkPipe,
		MainComponent
	],
	standalone: true
})
export class ChangePasswordComponent implements AfterViewInit, OnInit {

	protected form: FormGroup;

	protected success: boolean = false;

	protected errorCode: string | null = null;

	private key!: string;

	@ViewChild('passwordInput') passwordInputComponent!: PasswordInputComponent;
	@ViewChild('passwordRepeatInput') passwordRepeatInputComponent!: PasswordInputComponent;

	constructor(private restoreService: RestoreService,
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

			this.restoreService.checkKey(this.key).subscribe({
				next: (response) => {
					if (response.result === 'success') {
						this.cdr.detectChanges();
					}
				},
				error: (e) => {
					this.errorCode = e.error?.error;
					this.cdr.detectChanges();
				}
			});
		});
	}

	onSubmit() {
		this.errorCode = null;

		const value = this.form.value;

		if (value.password !== value.passwordRepeat) {
			this.passwordRepeatInputComponent.isInvalid = true;
			return;
		}

		this.passwordRepeatInputComponent.isInvalid = false;

		this.restoreService.setPassword(this.key, value.password).subscribe({
			next: (response) => {
				if (response.result === 'password_updated') {
					this.success = true;

					this.form.reset();
					this.cdr.detectChanges();
				}
			},
			error: (e) => {
				this.success = false;
				this.errorCode = e.error?.code;

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
