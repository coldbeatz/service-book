import { Component, ViewEncapsulation } from '@angular/core';
import { ApiRequestsService } from "../../services/api-requests.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: 'restore-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'restore.component.html',
	styleUrls: ['../login/login.component.scss']
})
export class RestoreComponent {

	protected form: FormGroup;

	protected success: boolean = false;
	protected errorCode!: string;

	constructor(private userService: ApiRequestsService, private fb: FormBuilder) {
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
					this.success = true;

					this.form.reset();
				}
			},
			error: (e) => {
				this.errorCode = e.error?.code;
			}
		});
	}
}
