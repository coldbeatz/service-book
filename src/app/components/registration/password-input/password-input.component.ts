import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { faUnlock, faLock } from '@fortawesome/free-solid-svg-icons';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: 'password-input-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'password-input.component.html',
	styleUrls: ['password-input.component.scss'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => PasswordInputComponent),
		multi: true
	}]
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

		if (this.showPassword) {

		}
	}

	writeValue(value: string | null): void {
		if (this.formControl && this.formControl.value !== value) {
			this.formControl.setValue(value, { emitEvent: false });
		}
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
