import { Component, forwardRef, Input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { AbstractFormInput } from "../form-input/abstract-form-input.component";
import { TranslateModule } from "@ngx-translate/core";

@Component({
	selector: 'number-form-input',
	standalone: true,
	imports: [
		FormsModule,
		CommonModule,
		TranslateModule
	],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => NumberFormInputComponent),
		multi: true
	}],
	templateUrl: 'number-form-input.component.html'
})
export class NumberFormInputComponent extends AbstractFormInput {

	@Input() min: number = Number.NEGATIVE_INFINITY;
	@Input() max: number = Number.POSITIVE_INFINITY;

	@Input() step: number = 1;

	onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'e' || event.key === 'E') {
			event.preventDefault();
		}
	}

	get value() {
		return Number(this.inputModel) || 0;
	}
}
