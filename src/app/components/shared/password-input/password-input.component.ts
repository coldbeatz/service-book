import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { faUnlock, faLock } from '@fortawesome/free-solid-svg-icons';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgClass } from "@angular/common";

@Component({
	selector: 'password-input-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'password-input.component.html',
	styleUrls: ['password-input.component.scss'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => PasswordInputComponent),
		multi: true
	}],
	imports: [
		ReactiveFormsModule,
		FaIconComponent,
		NgClass,
		FormsModule
	],
	standalone: true
})
export class PasswordInputComponent implements ControlValueAccessor {

	faUnlock = faUnlock;
	faLock = faLock;

	showPassword: boolean = false;
	isInvalid: boolean = false;

	@Input() placeholder!: string;
	@Input() formControl!: FormControl;

	private onChange: (value: string) => void = () => {};
	private onTouched: () => void = () => {};

	onSwitchPassword() {
		this.showPassword = !this.showPassword;
	}

	writeValue(value: string | null): void {
		if (this.formControl) {
			if (this.formControl.value !== value) {
				this.formControl.setValue(value, { emitEvent: false });
			}
		}
		this.onChange(value ?? '');
	}

	registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		if (this.formControl) {
			isDisabled ? this.formControl.disable() : this.formControl.enable();
		}
	}
}
