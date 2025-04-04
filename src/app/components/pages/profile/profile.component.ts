import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { TranslateModule } from "@ngx-translate/core";
import { environment } from "../../../../environments/environment";
import { FormsModule } from "@angular/forms";
import { User } from "../../../models/user";
import { PasswordWithRepeatComponent } from "../../shared/password-with-repeat/password-with-repeat.component";
import { AuthService } from "../../../services/auth.service";
import { SettingsRequest, ProfileService, SettingsResponse } from "../../../services/api/profile.service";
import { AlertComponent } from "../../shared/alert/alert.component";
import { UserService } from "../../../services/api/user.service";
import { MainComponent } from "../../shared/main/main.component";

@Component({
	selector: 'profile-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'profile.component.html',
	styleUrls: ['profile.component.scss'],
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
export class ProfileComponent implements OnInit {

	protected readonly environment = environment;

	user!: User;

	desiredEmailHtml: string | null = null;
	userUpdated: boolean = false;

	errorCode: string | null = null;

	@ViewChild('passwordWithRepeat') passwordWithRepeatComponent!: PasswordWithRepeatComponent;

	constructor(private cdr: ChangeDetectorRef,
				private userService: UserService,
				private settingsService: ProfileService,
				private authService: AuthService) {

	}

	ngOnInit(): void {
		this.loadUser();
	}

	private loadUser(): void {
		this.userService.getUser().subscribe({
			next: (userData) => {
				this.user = new User(userData);

				this.cdr.detectChanges();
			}
		})
	}

	disabledSubmitButton(): boolean {
		if (this.passwordWithRepeatComponent) {
			if (!this.passwordWithRepeatComponent.validationPasswords()) {
				return true;
			}
		}

		return !this.user.fullName || !this.user.email;

	}

	get showCurrentPassword(): boolean {
		return this.user ? !this.user.passwordIsEmpty : false;
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
			next: (response: SettingsResponse) => {
				if (response.emailConfirmationSent) {
					this.desiredEmailHtml = `<b>${settings.email}</b>`;
				}

				if (response.userUpdated) {
					this.loadUser();
					this.userUpdated = true;

					this.passwordWithRepeatComponent.clear();
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
