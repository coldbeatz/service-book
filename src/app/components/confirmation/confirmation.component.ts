import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ConfirmationService } from "../../user/confirmation/confirmation.service";
import { Confirmation } from "../../user/confirmation/confirmation";

@Component({
	selector: 'confirmation-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'confirmation.component.html',
	styleUrls: ['confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

	key: string | null = null;

	constructor(private route: ActivatedRoute, private confirmationService: ConfirmationService) {

	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			this.key = params.get('key');
			console.log('Confirmation key:', this.key);
		});
	}

	onSubmit() {
		if (this.key !== null) {
			this.confirmationService.confirm(new Confirmation(this.key));
		}
	}
}
