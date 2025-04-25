import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, } from '@angular/common/http';
import { AuthInterceptor } from "../../services/auth.interceptor";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService } from "../../services/auth.service";
import { ProfileService, SettingsResponse } from "../../services/api/profile.service";
import { UserService } from "../../services/api/user.service";
import { random } from "lodash";

describe('ProfileService Integration', () => {

	let service: ProfileService;

	let authService: AuthService;
	let userService: UserService;

	beforeEach((done) => {
		TestBed.configureTestingModule({
			imports: [
				TranslateModule.forRoot()
			],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				provideHttpClient(withInterceptorsFromDi()),
				ProfileService,
				UserService,
				AuthService
			]
		});

		service = TestBed.inject(ProfileService);
		authService = TestBed.inject(AuthService);
		userService = TestBed.inject(UserService);

		// Вхід в систему перед кожним тестом
		const loginRequest = {
			email: 'test@gmail.com',
			password: '123123'
		};

		userService.login(loginRequest).subscribe({
			next: (response) => {
				authService.login(response.email, response.token, true);
				done();
			},
			error: (e) => {
				fail('Login failed before tests: ' + e.message);
				done();
			}
		});
	});

	afterEach(() => {
		TestBed.resetTestingModule();
	});

	it ('TCPS01 Оновлення даних валідним email, новим паролем та enableEmailNewsletter = true', (done) => {
		const request = {
			email: 'test2@gmail.com',
			fullName: 'Test User',
			enableEmailNewsletter: true,
			currentPassword: '123123',
			newPassword: '123123'
		};

		service.updateUserSettings(request).subscribe({
			next: (response: SettingsResponse) => {
				expect(response).toBeTruthy();
				expect(response.userUpdated).toBeTrue();
				expect(response.updatedPassword).toBeTrue();
				expect(response.emailConfirmationSent).toBeTrue();
				done();
			},
			error: (e) => {
				console.error('Request failed: ' + e.message);

				fail('Request failed: ' + e.message);
				done();
			}
		});
	});

	it ('TCPS02 Оновлення даних fullName та enableEmailNewsletter, без нового пароля', (done) => {
		const request = {
			email: 'test@gmail.com',
			fullName: 'Test User' + random(1, 1000),
			enableEmailNewsletter: random(0, 1) === 1,
			currentPassword: null,
			newPassword: null
		};

		service.updateUserSettings(request).subscribe({
			next: (response: SettingsResponse) => {
				console.log(response);

				expect(response).toBeTruthy();
				expect(response.userUpdated).toBeTrue();
				expect(response.updatedPassword).toBeFalse();
				expect(response.emailConfirmationSent).toBeFalse();
				done();
			},
			error: (e) => {
				console.error('Request failed: ' + e.message);
				fail('Request failed: ' + e.message);
				done();
			}
		});
	});

	it ('TCPS03 Оновлення даних з некоректним email', (done) => {
		const request = {
			email: 'invalid-email-format',
			fullName: 'Test User',
			enableEmailNewsletter: true,
			currentPassword: null,
			newPassword: null
		};

		service.updateUserSettings(request).subscribe({
			next: () => {
				fail('Request should have failed due to invalid email format');
				done();
			},
			error: (e) => {
				expect(e.status).toBe(400);
				done();
			}
		});
	});

	it ('TCPS04 Оновлення даних з невірним поточним паролем', (done) => {
		const request = {
			email: 'test@mail.com',
			fullName: 'Test User',
			enableEmailNewsletter: true,
			currentPassword: 'wrongPassword',
			newPassword: 'newPassword123'
		};

		service.updateUserSettings(request).subscribe({
			next: () => {
				fail('Request should have failed due to incorrect current password');
				done();
			},
			error: (e) => {
				expect(e.status).toBe(400);
				done();
			}
		});
	});
});
