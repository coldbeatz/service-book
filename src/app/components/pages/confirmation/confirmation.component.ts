import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { ConfirmationService } from "../../../services/api/confirmation.service";
import { MainComponent } from "../../shared/main/main.component";

@Component({
	selector: 'confirmation-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'confirmation.component.html',
	imports: [
		CommonModule,
		RouterLink,
		TranslateModule,
		MainComponent
	],
	standalone: true
})
export class ConfirmationComponent implements OnInit {

	protected activationSuccess: boolean = false;

	protected errorCode: string | null = null;

	@Input() key: string | null = null;

	constructor(private confirmationService: ConfirmationService) {

	}

	ngOnInit(): void {
		if (this.key) {
			this.activation(this.key);
		}
	}

	private activation(key: string) {
		this.errorCode = null;
		this.activationSuccess = false;

		this.confirmationService.confirmUser(key).subscribe({
			next: (response) => {
				const { result } = response;

				if (result === 'confirmation_success') {
					this.activationSuccess = true;
				}
			},
			error: (e) => {
				this.activationSuccess = false;
				this.errorCode = e.error?.error;
			}
		});
	}
}
