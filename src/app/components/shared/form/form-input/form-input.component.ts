import { Component, forwardRef, Input } from '@angular/core';

import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { AbstractFormInput } from "./abstract-form-input.component";

@Component({
	selector: 'app-form-input',
	standalone: true,
	imports: [
		FormsModule,
		CommonModule
	],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => FormInputComponent),
		multi: true
	}],
	templateUrl: './form-input.component.html'
})
export class FormInputComponent extends AbstractFormInput {

	@Input() type: 'text' | 'email' | 'password' = 'text';
}
