import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MainComponent } from "../../internal/main/main.component";
import { RestoreService } from "../../../services/api/restore.service";

@Component({
	selector: 'restore-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'restore.component.html',
	styleUrls: ['restore.component.scss'],
	imports: [
		ReactiveFormsModule,
		CommonModule,
		RouterLink,
		TranslateModule,
		MainComponent,
		FormsModule
	],
	standalone: true
})
export class RestoreComponent {

	protected success: boolean = false;

	protected errorCode: string | null = null;

	protected email: string | null = null;

	constructor(private restoreService: RestoreService) {

	}

	disabled(): boolean {
		return !this.email;
	}

	onSubmit() {
		this.errorCode = null;
		this.success = false;

		if (this.email == null)
			return;

		this.restoreService.restore(this.email).subscribe({
			next: (response) => {
				if (response.result === 'restore_email_sent') {
					this.success = true;

					this.email = null;
				}
			},
			error: (e) => {
				this.success = false;
				this.errorCode = e.error?.error;
			}
		});
	}
}
