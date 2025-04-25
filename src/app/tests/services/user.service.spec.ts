import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, } from '@angular/common/http';
import { LoginRequest, LoginResponse, UserRegistrationRequest, UserService } from "../../services/api/user.service";
import { AuthInterceptor } from "../../services/auth.interceptor";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "../../services/language.service";
import { AuthService } from "../../services/auth.service";

describe('UserService Integration', () => {

	let service: UserService;
	let authService: AuthService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				TranslateModule.forRoot()
			],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				provideHttpClient(withInterceptorsFromDi()),
				LanguageService,
				UserService
			]
		});

		authService = TestBed.inject(AuthService);
		service = TestBed.inject(UserService);
	});

	it ('TCUSR01 Реєстрація користувача з некоректними (порожніми) даними', (done) => {
		const request: UserRegistrationRequest = {
			email: '',
			fullName: '',
			password: ''
		};

		service.register(request).subscribe({
			next: () => {
				fail('Registration should have failed with invalid data');
				done();
			},
			error: e => {
				expect(e.status).toBe(400);
				done();
			}
		});
	});

	it ('TCUSR02 + TCUSR03 Реєстрація користувача і спроба входу без підтвердженого e-mail', (done) => {
		const registerRequest: UserRegistrationRequest = {
			email: 'test@gmail.com',
			fullName: 'Test User',
			password: '1234'
		};

		service.register(registerRequest).subscribe({
			next: () => {
				const loginRequest = {
					email: registerRequest.email,
					password: registerRequest.password
				};

				service.login(loginRequest).subscribe({
					next: () => {
						fail('Login should have failed because email is not confirmed');
						done();
					},
					error: e => {
						expect(e.status).toBe(400);
						done();
					}
				});
			},
			error: e => {
				fail('Registration failed: ' + e.message);
				done();
			}
		});
	});

	it ('TCUSR04 Реєстрація користувача з вже існуючим e-mail', (done) => {
		const request: UserRegistrationRequest = {
			email: 'vbhrytsenko@gmail.com',
			fullName: 'Test user',
			password: '123123'
		};

		service.register(request).subscribe({
			next: () => {
				fail('Registration should have failed with invalid data');
				done();
			},
			error: e => {
				expect(e.status).toBe(400);
				done();
			}
		});
	});

	it ('TCUSR05 Вхід користувача в систему з невірними даними', (done) => {
		const request = {
			email: 'wrong@gmail.com',
			password: 'wrong'
		};

		service.login(request).subscribe({
			next: () => {
				fail('Login should have failed with incorrect credentials');
				done();
			},
			error: e => {
				expect(e.status).toBe(401);
				done();
			}

		});
	});

	it ('TCUSR06 + TCUSR07  Успішний вхід в систему + отримання авторизованого користувача', (done) => {
		const request: LoginRequest = {
			email: 'vbhrytsenko@gmail.com',
			password: '123123'
		};

		service.login(request).subscribe({
			next: (response: LoginResponse) => {
				authService.login(response.email, response.token, true);

				expect(response).toBeTruthy();
				expect(response.token).not.toBeNull();

				service.getUser().subscribe({
					next: (user) => {
						expect(user).toBeTruthy();
						expect(user.email).toEqual(response.email);
						done();
					},
					error: error => {
						fail('Request failed: ' + error.message);
						done();
					}
				});
			},
			error: e => {
				fail('Login failed: ' + e.message);
				done();
			}
		});
	});

	it ('TCUSR08 Успішна валідація JWT токена', (done) => {
		const email = 'vbhrytsenko@gmail.com';
		const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJpZCI6MTksImVtYWlsIjoidmJocnl0c2Vua29AZ21haWwuY29tIiwic3ViIjoidmJocnl0c2Vua29AZ21haWwuY29tIiwiaWF0IjoxNzQ1NDc0NDkzLCJleHAiOjE3NDgwNjY0OTN9.Rvi92sp8ephTeF8ZXVM0brxWiA7aDUF6HcGgKLNNPW8'; // <-- подставь валидный рабочий токен!

		service.tokenValidation(email, token).subscribe({
			next: (response) => {
				expect(response.result).toBe('token_valid');
				done();
			},
			error: (e) => {
				fail('Token validation should not have failed: ' + e.message);
				done();
			}
		});
	});

	it ('TCUSR09 Невдала валідація JWT токена', (done) => {
		service.tokenValidation(null, null).subscribe({
			next: () => {
				fail('Token validation should have failed with null data');
				done();
			},
			error: (e) => {
				expect(e.status).toBe(401);
				done();
			}
		});
	});
});
