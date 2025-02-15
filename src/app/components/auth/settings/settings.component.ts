import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "../../internal/main/main.component";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { TranslateModule } from "@ngx-translate/core";
import { ApiRequestsService } from "../../../services/api-requests.service";
import { environment } from "../../../../environments/environment";
import { FormsModule } from "@angular/forms";
import { User } from "../../../user/user";
import { PasswordWithRepeatComponent } from "../../shared/password-with-repeat/password-with-repeat.component";
import { AuthService } from "../../../services/auth.service";
import { SettingsRequest, SettingsService } from "../../../services/api/settings.service";
import { AlertComponent } from "../../internal/alert/alert.component";

@Component({
	selector: 'settings-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'settings.component.html',
	styleUrls: ['settings.component.scss'],
	imports: [
		CommonModule,
		MainComponent,
		BreadcrumbComponent,
		TranslateModule,
		FormsModule,
		PasswordWithRepeatComponent,
		AlertComponent
	],
	standalone: true
})
export class SettingsComponent implements OnInit {

	user!: User;

	desiredEmailHtml: string | null = null;
	userUpdated: boolean = false;

	errorCode: string | null = null;

	@ViewChild('passwordWithRepeat') passwordWithRepeatComponent!: PasswordWithRepeatComponent;

	constructor(private apiRequestsService: ApiRequestsService,
				private settingsService: SettingsService,
				private authService: AuthService) {

	}

	ngOnInit(): void {
		this.loadUser();
	}

	private loadUser(): void {
		this.apiRequestsService.getUser().subscribe({
			next: (userData) => this.user = new User(userData)
		})
	}

	protected readonly environment = environment;

	disabledSubmitButton(): boolean {
		if (this.passwordWithRepeatComponent) {
			if (!this.passwordWithRepeatComponent.validationPasswords()) {
				return true;
			}
		}

		return !this.user.fullName || !this.user.email;

	}

	onSubmit() {
		this.desiredEmailHtml = null;
		this.userUpdated = false;
		this.errorCode = null;

		if (!this.passwordWithRepeatComponent.validationPasswords()) {
			return;
		}

		const settings: SettingsRequest = {
			email: this.user.email,
			fullName: this.user.fullName,
			enableEmailNewsletter: this.user.enableEmailNewsletter,
			currentPassword: this.passwordWithRepeatComponent.currentPassword,
			newPassword: this.passwordWithRepeatComponent.password
		}

		this.settingsService.updateUserSettings(settings).subscribe({
			next: (response) => {
				if (response.emailConfirmationSent) {
					this.desiredEmailHtml = `<b>${settings.email}</b>`;
				}

				if (response.userUpdated) {
					this.loadUser();
					this.userUpdated = true;
				}

				let token = response.token;
				if (token) {
					this.authService.updateToken(token);
				}
			},
			error: (e) => {
				this.errorCode = e.error;
			}
		});

	}
}
