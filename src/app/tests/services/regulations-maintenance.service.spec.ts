import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { RegulationsMaintenanceService } from '../../services/api/regulations-maintenance.service';
import { AuthInterceptor } from '../../services/auth.interceptor';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/api/user.service';
import { loginBeforeTests } from "../test-auth.helper";
import { RegulationsMaintenance } from "../../models/regulations-maintenance.model";
import { CarTransmissionType } from "../../models/car-transmission-type.model";
import { MaintenanceWorkType } from "../../models/maintenance-work-type.model";

describe('RegulationsMaintenanceService Integration', () => {

	let service: RegulationsMaintenanceService;

	beforeEach((done) => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				provideHttpClient(withInterceptorsFromDi()),
				RegulationsMaintenanceService,
				AuthService,
				UserService
			]
		});

		service = TestBed.inject(RegulationsMaintenanceService);

		let authService = TestBed.inject(AuthService);
		let userService = TestBed.inject(UserService);

		loginBeforeTests(userService, authService, done);
	});

	it ('TCRM01 Отримання списку регламентів', (done) => {
		service.getRegulationsMaintenance().subscribe({
			next: (maintenances: RegulationsMaintenance[]) => {
				expect(Array.isArray(maintenances)).toBeTrue();
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCRM02 Створення нового регламенту, очікується створений обʼєкт', (done) => {
		const newMaintenance = new RegulationsMaintenance();

		newMaintenance.workDescription = { en: 'Oil Change', ua: 'Заміна масла' };
		newMaintenance.transmissions = [CarTransmissionType.AUTOMATIC];
		newMaintenance.fuelTypes = [];
		newMaintenance.useDefault = false;
		newMaintenance.tasks = [
			{
				id: 0,
				interval: 0,
				specificMileage: 0,
				workType: MaintenanceWorkType.INSPECTION
			}
		];

		service.saveOrUpdateRegulationsMaintenance(newMaintenance).subscribe({
			next: (maintenance) => {
				expect(maintenance).toBeTruthy();
				expect(maintenance.id).toBeGreaterThan(0);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCRM03 Оновлення регламенту, очікується оновлений обʼєкт', (done) => {
		const updatedMaintenance = new RegulationsMaintenance();

		updatedMaintenance.id = 567;
		updatedMaintenance.workDescription = { en: 'Updated Work', ua: 'Оновлені роботи' };
		updatedMaintenance.transmissions = [CarTransmissionType.AUTOMATIC];
		updatedMaintenance.fuelTypes = [];
		updatedMaintenance.useDefault = false;
		updatedMaintenance.tasks = [
			{
				id: 0,
				interval: 0,
				specificMileage: 0,
				workType: MaintenanceWorkType.INSPECTION
			}
		];

		service.saveOrUpdateRegulationsMaintenance(updatedMaintenance).subscribe({
			next: (maintenance) => {
				expect(maintenance).toBeTruthy();
				expect(maintenance.workDescription.en).toEqual(updatedMaintenance.workDescription.en);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCRM04 Видалення регламенту з id, очікується статус 204', (done) => {
		const maintenance = new RegulationsMaintenance();

		maintenance.id = 568;

		service.deleteRegulationsMaintenance(maintenance).subscribe({
			next: () => {
				expect(true).toBeTrue();
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCRM05 Спроба видалення регламенту з id = -1', (done) => {
		const maintenance = new RegulationsMaintenance();

		maintenance.id = -1;

		service.deleteRegulationsMaintenance(maintenance).subscribe({
			next: () => {
				fail('Очікувалась помилка, але отримано успішну відповідь');
				done();
			},
			error: (e) => {
				expect(e.status).toBe(404);
				done();
			}
		});
	});
});
