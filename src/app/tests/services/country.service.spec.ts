import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CountryService } from '../../services/api/country.service';
import { AuthInterceptor } from '../../services/auth.interceptor';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/api/user.service";
import { loginBeforeTests } from "../test-auth.helper";

describe('CountryService Integration', () => {

	let service: CountryService;

	beforeEach((done) => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				provideHttpClient(withInterceptorsFromDi()),
				CountryService
			]
		});

		service = TestBed.inject(CountryService);

		let authService = TestBed.inject(AuthService);
		let userService = TestBed.inject(UserService);

		loginBeforeTests(userService, authService, done);
	});

	it ('TCCOUNTRY01 Отримання списку країн', (done) => {
		service.getCountries().subscribe({
			next: (countries) => {
				expect(Array.isArray(countries)).toBeTrue();
				expect(countries.length).toBeGreaterThan(0);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});
});
