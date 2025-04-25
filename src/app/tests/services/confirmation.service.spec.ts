import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ConfirmationService } from '../../services/api/confirmation.service';
import { TranslateModule } from '@ngx-translate/core';

describe('ConfirmationService Integration', () => {

	let service: ConfirmationService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [
				provideHttpClient(),
				ConfirmationService
			]
		});

		service = TestBed.inject(ConfirmationService);
	});

	it ('TCCONF01 Підтвердження e-mail з валідним ключем, очікується confirmation_success', (done) => {
		service.confirmUser('uj5kMiyw8MpFpLDq').subscribe({
			next: (response) => {
				expect(response).toBeTruthy();
				expect(response.result).toBe('confirmation_success');
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCCONF02 Спроба підтвердження e-mail з невалідним або порожнім ключем, очікується помилка', (done) => {
		service.confirmUser('unknown_key').subscribe({
			next: () => {
				fail('Очікувалась помилка, але отримано успішну відповідь');
				done();
			},
			error: (e) => {
				expect(e.error.error).toBe('key_is_missing');
				expect(e.status).toBe(400);
				done();
			}
		});
	});
});
