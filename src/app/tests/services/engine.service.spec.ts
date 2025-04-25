import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EngineService } from '../../services/api/engine.service';
import { AuthInterceptor } from '../../services/auth.interceptor';
import { Engine } from '../../models/engine.model';
import { Car } from '../../models/car.model';
import { FuelType } from '../../models/fuel-type.model';
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/api/user.service";
import { loginBeforeTests } from "../test-auth.helper";
import { TranslateModule } from "@ngx-translate/core";

describe('EngineService Integration', () => {

	let service: EngineService;

	beforeEach((done) => {
		TestBed.configureTestingModule({
			imports: [
				TranslateModule.forRoot()
			],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				provideHttpClient(withInterceptorsFromDi()),
				EngineService
			]
		});

		service = TestBed.inject(EngineService);

		let authService = TestBed.inject(AuthService);
		let userService = TestBed.inject(UserService);

		loginBeforeTests(userService, authService, done);
	});

	it ('TCENG01 Створення нового двигуна без id, очікується створений Engine', (done) => {
		const engine: Engine = {
			id: 0,
			name: '2.0 TDI',
			displacement: 2.0,
			horsepower: 150,
			fuelType: FuelType.DIESEL,
			car: { id: 11 } as Car,
			createdAt: null,
			updatedAt: null
		};

		service.saveOrUpdateEngine(engine).subscribe({
			next: (created) => {
				expect(created).toBeTruthy();
				expect(created.id).toBeGreaterThan(0);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCENG02 Оновлення існуючого двигуна, очікується оновлений Engine', (done) => {
		const engine: Engine = {
			id: 24,
			name: '3.5 V6',
			displacement: 3.5,
			horsepower: 280,
			fuelType: FuelType.PETROL,
			car: { id: 11 } as Car,
			createdAt: null,
			updatedAt: null
		};

		service.saveOrUpdateEngine(engine).subscribe({
			next: (updated) => {
				expect(updated).toBeTruthy();
				expect(updated.id).toEqual(engine.id);
				expect(updated.horsepower).toBe(280);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCENG03 Спроба зберегти двигун без привʼязаного авто, очікується помилка', () => {
		const engine: Engine = {
			id: 0,
			name: '1.6 MPI',
			displacement: 1.6,
			horsepower: 110,
			fuelType: FuelType.PETROL,
			car: null!,
			createdAt: null,
			updatedAt: null
		};

		expect(() => service.saveOrUpdateEngine(engine)).toThrowError('Car is null!');
	});

	it ('TCENG04 Видалення двигуна, очікується статус 204', (done) => {
		const engine: Engine = {
			id: 25,
			car: { id: 11 } as Car
		} as Engine;

		service.deleteEngine(engine).subscribe({
			next: () => done(),
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCENG05 Видалення двигуна без car або id, очікується помилка 404', (done) => {
		const engine: Engine = {
			id: -1,
			car: { id: -1 } as Car
		} as Engine;

		service.deleteEngine(engine).subscribe({
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
});
