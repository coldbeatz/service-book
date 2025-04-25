import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrandService } from '../../services/api/brand.service';
import { AuthInterceptor } from '../../services/auth.interceptor';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/api/user.service";
import { Brand } from "../../models/brand.model";
import { random } from "lodash";

describe('BrandService Integration', () => {

	let service: BrandService;

	let authService: AuthService;
	let userService: UserService;

	beforeEach((done) => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				provideHttpClient(withInterceptorsFromDi()),
				BrandService
			]
		});

		service = TestBed.inject(BrandService);

		authService = TestBed.inject(AuthService);
		userService = TestBed.inject(UserService);

		// Вхід в систему перед кожним тестом
		const loginRequest = {
			email: 'vbhrytsenko@gmail.com',
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

	it ('TCBR01 Отримання списку всіх брендів, очікується масив обʼєктів Brand[]', (done) => {
		service.getBrands().subscribe({
			next: (brands) => {
				expect(Array.isArray(brands) && brands.length > 0).toBeTrue();
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCBR02 Отримання бренду за id, очікується обʼєкт Brand', (done) => {
		service.getBrandById(1).subscribe({
			next: (brand: Brand) => {
				expect(brand).toBeTruthy();
				expect(brand.id).toBe(1);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCBR03 Спроба отримати бренд за невалідним id = -1, очікується помилка', (done) => {
		service.getBrandById(-1).subscribe({
			next: () => {
				fail('Очікувалась помилка, але отримано успішну відповідь');
				done();
			},
			error: (e) => {
				expect(e.error.error).toBe('entity_not_found');
				expect(e.status).toBe(404);
				done();
			}
		});
	});

	it ('TCBR04 + TCBR02 Отримання кількості автомобілів для бренду з id = 1', (done) => {
		service.getBrandById(1).subscribe({
			next: (brand: Brand) => {
				expect(brand).toBeTruthy();
				expect(brand.id).toBe(1);

				service.getCarsCountByBrand(brand).subscribe({
					next: (response) => {
						expect(response).toBeTruthy();
						expect(typeof response.count).toBe('number');
						done();
					},
					error: (e) => {
						fail('Очікувався успіх, але отримано помилку: ' + e.message);
						done();
					}
				});
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	function base64ToFile(base64: string, filename: string, mimeType: string): File {
		const byteString = atob(base64.split(',')[1]);
		const byteArray = new Uint8Array(byteString.length);

		for (let i = 0; i < byteString.length; i++) {
			byteArray[i] = byteString.charCodeAt(i);
		}

		return new File([byteArray], filename, { type: mimeType });
	}

	it ('TCBR05 Створення нового бренду, очікується створений бренд', (done) => {
		const newBrand: Brand = {
			id: 0,
			brand: 'Toyota ' + random(1, 1000),
			country: {
				id: 7,
				code: 'UA',
				name: { en: '', ua: '' },
				iconResource: { url: '' },
			},
			imageResource: {
				url: ''
			}
		};

		const base64 = 'data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7';
		const file = base64ToFile(base64, 'logo.png', 'image/png');

		service.saveOrUpdateBrand(newBrand, file).subscribe({
			next: (brand) => {
				expect(brand).toBeTruthy();
				expect(brand.id).toBeGreaterThan(0);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCBR06 + TCBR02 Оновлення існуючого бренду, очікується оновлений бренд', (done) => {
		service.getBrandById(1).subscribe({
			next: (findBrand: Brand) => {
				findBrand.brand = 'Chevrolet';

				service.saveOrUpdateBrand(findBrand, null).subscribe({
					next: (brand) => {
						expect(brand).toBeTruthy();
						expect(brand.brand).toEqual('Chevrolet');
						done();
					},
					error: (e) => {
						fail('Очікувався успіх, але отримано помилку: ' + e.message);
						done();
					}
				});
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});
});
