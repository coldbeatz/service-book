import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CarService } from '../../services/api/car.service';
import { AuthInterceptor } from '../../services/auth.interceptor';
import { TranslateModule } from '@ngx-translate/core';
import { Car } from '../../models/car.model';
import { Brand } from '../../models/brand.model';
import { CarTransmissionType } from "../../models/car-transmission-type.model";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/api/user.service";

describe('CarService Integration', () => {

	let service: CarService;

	let authService: AuthService;
	let userService: UserService;

	beforeEach((done) => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				provideHttpClient(withInterceptorsFromDi()),
				CarService
			]
		});

		service = TestBed.inject(CarService);

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

	it ('TCCS01 Отримання автомобіля за id, очікується обʼєкт Car', (done) => {
		service.getCarById(3).subscribe({
			next: (car: Car) => {
				expect(car).toBeTruthy();
				expect(car.id).toBe(3);
				done();
			},
			error: (e) => {
				fail('Отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCCS02 Спроба отримати авто з id = -1, очікується помилка', (done) => {
		service.getCarById(-1).subscribe({
			next: () => {
				fail('Очікувалась помилка, але отримано успіх');
				done();
			},
			error: (e) => {
				expect(e.error.error).toBe('entity_not_found');
				expect(e.status).toBe(404);
				done();
			}
		});
	});

	it ('TCCS03 Отримання списку авто для конкретного бренду', (done) => {
		const brand: Brand = { id: 4, brand: 'Toyota', country: null, imageResource: { url: '' } };

		service.getCarsByBrand(brand).subscribe({
			next: (cars: Car[]) => {
				expect(Array.isArray(cars)).toBeTrue();
				done();
			},
			error: (e) => {
				fail('Отримано помилку: ' + e.message);
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

	it ('TCCS04 Створення нового авто з валідними даними', (done) => {
		const newCar: Car = new Car();

		newCar.brand = { id: 2, brand: 'Ford', country: null, imageResource: { url: '' } };
		newCar.model = 'Test Model';
		newCar.startYear = 2020;
		newCar.endYear = 2025;
		newCar.transmissions = [CarTransmissionType.AUTOMATIC];

		const base64 = 'data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7';
		const file = base64ToFile(base64, 'logo.png', 'image/png');

		service.saveOrUpdateCar(newCar, file).subscribe({
			next: (car) => {
				expect(car).toBeTruthy();
				expect(car.id).toBeGreaterThan(0);
				done();
			},
			error: (e) => {
				fail('Отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCCS05 Оновлення існуючого авто', (done) => {
		service.getCarById(8).subscribe({
			next: (car: Car) => {
				car.model = 'Updated Model';

				service.saveOrUpdateCar(car, null).subscribe({
					next: (updatedCar) => {
						expect(updatedCar).toBeTruthy();
						expect(updatedCar.model).toBe('Updated Model');
						done();
					},
					error: (e) => {
						fail('Отримано помилку: ' + e.message);
						done();
					}
				});
			},
			error: (e) => {
				fail('Отримано помилку при отриманні авто: ' + e.message);
				done();
			}
		});
	});

	it ('TCCS06 Помилка, якщо brand = null при збереженні авто', () => {
		const invalidCar: Car = new Car();

		invalidCar.model = 'Test Model';
		invalidCar.startYear = 2020;
		invalidCar.endYear = 2025;
		invalidCar.brand = null;

		expect(() => service.saveOrUpdateCar(invalidCar, null)).toThrowError('Car brand is null!');
	});

	it ('TCCS07 Видалення авто з id = 10, очікується HTTP 204', (done) => {
		const car: Car = new Car();
		car.id = 10;

		service.deleteCar(car).subscribe({
			next: () => done(),
			error: (e) => {
				fail('Отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCCS08 Спроба видалити авто з id = -1, очікується помилка', (done) => {
		const car: Car = new Car();
		car.id = -1;

		service.deleteCar(car).subscribe({
			next: () => {
				fail('Очікувалась помилка, але отримано успіх');
				done();
			},
			error: (e) => {
				expect(e.error.error).toBe('entity_not_found');
				expect(e.status).toBe(404);
				done();
			}
		});
	});
});
