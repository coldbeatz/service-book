import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CarRegulationsMaintenanceService } from '../../services/api/car-regulations-maintenance.service';
import { AuthInterceptor } from '../../services/auth.interceptor';
import { TranslateModule } from '@ngx-translate/core';
import { Car } from "../../models/car.model";
import { loginBeforeTests } from "../test-auth.helper";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/api/user.service";

describe('CarRegulationsMaintenanceService Integration', () => {

	let service: CarRegulationsMaintenanceService;

	beforeEach((done) => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				provideHttpClient(withInterceptorsFromDi()),
				CarRegulationsMaintenanceService
			]
		});

		service = TestBed.inject(CarRegulationsMaintenanceService);

		let authService = TestBed.inject(AuthService);
		let userService = TestBed.inject(UserService);

		loginBeforeTests(userService, authService, done);
	});

	it ('TCCRM01: Ініціалізація регламентів для існуючого автомобіля', (done) => {
		const car: Car = new Car();
		car.id = 11;

		service.initializeDefaultMaintenances(car).subscribe({
			next: (maintenances) => {
				expect(Array.isArray(maintenances)).toBeTrue();
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCCRM02: Ініціалізація регламентів для неіснуючого автомобіля', (done) => {
		const car: Car = new Car();
		car.id = 0;

		service.initializeDefaultMaintenances(car).subscribe({
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

	it ('TCCRM03: Видалення регламентів для існуючого автомобіля (ID = 10)', (done) => {
		const car: Car = new Car();
		car.id = 8;

		service.deleteAll(car).subscribe({
			next: () => done(),
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCCRM04: Спроба видалити регламенти для неіснуючого автомобіля', (done) => {
		const car: Car = new Car();
		car.id = -1;

		service.deleteAll(car).subscribe({
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
