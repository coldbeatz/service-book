import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ApiErrorsService } from "../../services/api-errors.service";
import { ApiRequestsService } from "../../services/api-requests.service";

@Component({
	selector: 'confirmation-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'confirmation.component.html'
})
export class ConfirmationComponent implements OnInit {

	protected activationSuccess: boolean = false;

	protected errorMessage: string|null = null;

	constructor(private route: ActivatedRoute,
				private apiRequestsService: ApiRequestsService,
				private apiErrorsService: ApiErrorsService) {

	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			const key = params.get('key');

			if (key != null) {
				this.activation(key);
			}
		});
	}

	private activation(key: string) {
		this.apiRequestsService.confirmUser(key).subscribe({
			next: (response) => {
				if (response.result === 'success') {
					this.errorMessage = null;
					this.activationSuccess = true;
				}
			},
			error: (e) => {
				this.activationSuccess = false;

				this.errorMessage = this.apiErrorsService.getMessage('confirmation', e.error?.code);
			}
		});
	}
}
