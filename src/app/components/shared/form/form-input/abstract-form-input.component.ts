import {
	AfterContentChecked, ChangeDetectorRef,
	ContentChild, Directive,
	ElementRef, inject,
	Input,
	TemplateRef,
	ViewChild
} from '@angular/core';

import { ControlValueAccessor } from '@angular/forms';

@Directive()
export abstract class AbstractFormInput implements ControlValueAccessor, AfterContentChecked {

	protected changeDetector = inject(ChangeDetectorRef);

	@Input() id!: string;

	@Input() label!: string;
	@Input() placeholder: string = '';
	@Input() help: string = '';

	@Input() required: boolean = false;
	@Input() inputModel!: any;

	@ContentChild('errorsTemplate') errorTemplate!: TemplateRef<any>;
	@ViewChild('errorContainer', { static: false }) errorContainer!: ElementRef;

	onChange = (_: any) => {};
	onTouched = () => {};

	userInteracted: boolean = false;

	onInputChange(value: any): void {
		this.inputModel = value;
		this.onChange(value);
	}

	writeValue(value: any): void {
		this.inputModel = value;
	}

	registerOnChange(fn: any): void {
		this.onChange = (value: any) => {
			this.userInteracted = true;
			fn(value);
		};
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	hasErrors(): boolean {
		return this.userInteracted && this.errorContainer?.nativeElement?.children.length > 0;
	}

	isValid(): boolean {
		return this.userInteracted && this.errorContainer?.nativeElement?.children.length == 0;
	}

	ngAfterContentChecked() {
		this.changeDetector.detectChanges();
	}
}
