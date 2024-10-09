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

	errorKey: string | null = null;
	activationSuccess: boolean = false;

	constructor(private route: ActivatedRoute, private confirmationService: ConfirmationService) {

	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			this.confirmation = new ConfirmationRequest(params.get('key'));
		});
	}

	onSubmit() {
		this.confirmationService.confirm(this);
	}
}
