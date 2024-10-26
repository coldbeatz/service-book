import { Component, ViewEncapsulation } from '@angular/core';
import { ApiRequestsService } from "../../services/api-requests.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiErrorsService } from "../../services/api-errors.service";

@Component({
	selector: 'restore-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'restore.component.html'
})
export class RestoreComponent {

	protected form: FormGroup;

	protected success: boolean = false;

	protected errorMessage: string|null = null;
	protected errorCode: string|null = null;

	constructor(private userService: ApiRequestsService,
				private apiErrorsService: ApiErrorsService,
				private fb: FormBuilder) {

		this.form = this.fb.group({
			email: ['', [Validators.required]]
		});
	}

	onSubmit() {
		this.success = false;

		const data = this.form.value;

		let email = data.email;
		if (email == null) return;

		this.userService.restore(email).subscribe({
			next: (response) => {
				if (response.result === 'success') {
					this.errorMessage = this.errorCode = null;
					this.success = true;

					this.form.reset();
				}
			},
			error: (e) => {
				this.success = false;

				this.errorCode = e.error?.code;
				this.errorMessage = this.apiErrorsService.getMessage('restore', this.errorCode);
			}
		});
	}
}
