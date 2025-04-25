import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UserCarService } from '../../services/api/user-car.service';
import { AuthInterceptor } from '../../services/auth.interceptor';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/api/user.service";
import { UserCar } from "../../models/user-car.model";
import { FuelType } from "../../models/fuel-type.model";
import { CarTransmissionType } from "../../models/car-transmission-type.model";
import { getSimpleImageFile, loginBeforeTests } from "../test-auth.helper";
import { Car } from "../../models/car.model";

describe('UserCarService Integration', () => {

	let service: UserCarService;

	beforeEach((done) => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				provideHttpClient(withInterceptorsFromDi()),
				UserCarService
			]
		});

		service = TestBed.inject(UserCarService);

		let authService = TestBed.inject(AuthService);
		let userService = TestBed.inject(UserService);

		loginBeforeTests(userService, authService, done);
	});

	it ('TCUCAR01 Отримання всіх автомобілів користувача', (done) => {
		service.getUserCars().subscribe({
			next: (cars) => {
				expect(Array.isArray(cars)).toBeTrue();
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCUCAR02 Отримання автомобіля користувача за валідним id', (done) => {
		service.getUserCarById(5).subscribe({
			next: (car) => {
				expect(car).toBeTruthy();
				expect(car.id).toBe(5);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCUCAR03 Отримання авто, що не належить користувачу (id = 1)', (done) => {
		service.getUserCarById(1).subscribe({
			next: () => {
				fail('Очікувалась помилка, але отримано успіх');
				done();
			},
			error: (e) => {
				expect(e.error.error).toBe('access_denied');
				expect(e.status).toBe(403);
				done();
			}
		});
	});

	it ('TCUCAR04 Створення нового автомобіля з валідними даними', (done) => {
		const newUserCar = new UserCar();

		newUserCar.car = { id: 4 } as Car
		newUserCar.fuelType = FuelType.PETROL;
		newUserCar.transmissionType = CarTransmissionType.AUTOMATIC;
		newUserCar.licensePlate = 'AA1234BB';
		newUserCar.vinCode = '1HGCM82633A004352';
		newUserCar.vehicleMileage = 150000;
		newUserCar.vehicleYear = 2015;

		service.saveOrUpdateUserCar(newUserCar, getSimpleImageFile()).subscribe({
			next: (car) => {
				expect(car).toBeTruthy();
				expect(car.id).toBeGreaterThan(0);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCUCAR05 Оновлення існуючого автомобіля без зображення', (done) => {
		const existingUserCar = new UserCar();

		existingUserCar.id = 5;
		existingUserCar.car = { id: 1 } as Car
		existingUserCar.fuelType = FuelType.PETROL;
		existingUserCar.transmissionType = CarTransmissionType.AUTOMATIC;
		existingUserCar.licensePlate = 'ВІ4534ОО';
		existingUserCar.vinCode = 'JTEBU25J885116726';
		existingUserCar.vehicleMileage = 160000;
		existingUserCar.vehicleYear = 2016;

		service.saveOrUpdateUserCar(existingUserCar, null).subscribe({
			next: (car) => {
				expect(car).toBeTruthy();
				expect(car.id).toBe(5);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCUCAR06 Кидання помилки при відсутності car', () => {
		const invalidUserCar = new UserCar();

		invalidUserCar.id = 5;

		invalidUserCar.car = null;

		invalidUserCar.fuelType = FuelType.PETROL;
		invalidUserCar.transmissionType = CarTransmissionType.AUTOMATIC;
		invalidUserCar.licensePlate = 'ВІ4534ОО';
		invalidUserCar.vinCode = 'JTEBU25J885116726';
		invalidUserCar.vehicleMileage = 160000;
		invalidUserCar.vehicleYear = 2016;

		expect(() => service.saveOrUpdateUserCar(invalidUserCar, null)).toThrowError('Car is null');
	});

	it ('TCUCAR07 Кидання помилки при відсутності fuelType', () => {
		const invalidUserCar = new UserCar();

		invalidUserCar.id = 5;
		invalidUserCar.car = { id: 1 } as Car;

		invalidUserCar.fuelType = null;

		invalidUserCar.transmissionType = CarTransmissionType.AUTOMATIC;
		invalidUserCar.licensePlate = 'ВІ4534ОО';
		invalidUserCar.vinCode = 'JTEBU25J885116726';
		invalidUserCar.vehicleMileage = 160000;
		invalidUserCar.vehicleYear = 2016;

		expect(() => service.saveOrUpdateUserCar(invalidUserCar, null)).toThrowError('Fuel type is null');
	});

	it ('TCUCAR08 Кидання помилки при відсутності transmissionType', () => {
		const invalidUserCar = new UserCar();

		invalidUserCar.id = 5;
		invalidUserCar.car = { id: 1 } as Car;
		invalidUserCar.fuelType = FuelType.PETROL;

		invalidUserCar.transmissionType = null;

		invalidUserCar.licensePlate = 'ВІ4534ОО';
		invalidUserCar.vinCode = 'JTEBU25J885116726';
		invalidUserCar.vehicleMileage = 160000;
		invalidUserCar.vehicleYear = 2016;

		expect(() => service.saveOrUpdateUserCar(invalidUserCar, null)).toThrowError('Transmission type is null');
	});

	it ('TCUCAR09 Видалення автомобіля користувача з валідним id', (done) => {
		const carToDelete: UserCar = { id: 7 } as UserCar;

		service.deleteUserCar(carToDelete).subscribe({
			next: () => done(),
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCUCAR010 Видалення автомобіля з id = -1, очікується помилка', (done) => {
		const invalidCar: UserCar = { id: -1 } as UserCar;

		service.deleteUserCar(invalidCar).subscribe({
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
