import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ConfirmationService } from "./confirmation.service";
import { ConfirmationRequest } from "./confirmation.request";

@Component({
	selector: 'confirmation-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'confirmation.component.html',
	styleUrls: ['confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

	confirmation: ConfirmationRequest | null = null;

	errorCode: string | null = null;
	activationSuccess: boolean = false;

	constructor(private route: ActivatedRoute, private confirmationService: ConfirmationService) {

	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			this.confirmation = new ConfirmationRequest(params.get('key'));

			this.activation();
		});
	}

	private activation() {
		if (this.confirmation?.key == null)
			return;

		this.confirmationService.confirm(this).subscribe({
			next: (response) => {
				if (response.result === 'success') {
					this.errorCode = null;
					this.activationSuccess = true;
				}
			},
			error: (e) => {
				this.activationSuccess = false;

				if (e.error?.code === 'key_is_missing') {
					this.errorCode = 'key_is_missing';
				} else {
					this.errorCode = 'unknown_error'
				}
			}
		});
	}
}
