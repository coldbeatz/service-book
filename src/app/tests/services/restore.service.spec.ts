import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { RestoreService } from '../../services/api/restore.service';
import { TranslateModule } from '@ngx-translate/core';

describe('RestoreService Integration', () => {

	let service: RestoreService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				TranslateModule.forRoot()
			],
			providers: [
				provideHttpClient(),
				RestoreService
			]
		});

		service = TestBed.inject(RestoreService);
	});

	it ('TCRS01 Перевірка ключа для відновлення пароля', (done) => {
		service.checkKey('uj5kMiyw8MpFpLDq').subscribe({
			next: (response) => {
				expect(response.result).toBe('key_valid');
				done();
			},
			error: (e) => {
				fail('Expected success, but got error: ' + e.message);
				done();
			}
		});
	});

	it ('TCRS02 Перевірка ключа для відновлення пароля (ключ не валідний)', (done) => {
		service.checkKey('invalid-key').subscribe({
			next: () => {
				fail('Expected error, but got success');
				done();
			},
			error: (e) => {
				expect(e.error.error).toBe('key_is_invalid');
				expect(e.status).toBe(400);
				done();
			}
		});
	});

	it ('TCRS03 Спроба відправки листа для відновлення пароля на не зареєстрований e-mail', (done) => {
		service.restore('unregister@gmail.com').subscribe({
			next: () => {
				fail('Expected error, but got success');
				done();
			},
			error: (e) => {
				expect(e.error.error).toBe('email_not_registered');
				expect(e.status).toBe(400);
				done();
			}
		});
	});

	it ('TCRS04 Спроба відправки листа для відновлення пароля на не підтверджений e-mail', (done) => {
		service.restore('unconfirmed@gmail.com').subscribe({
			next: () => {
				fail('Expected error, but got success');
				done();
			},
			error: (e) => {
				expect(e.error.error).toBe('email_not_confirmed');
				expect(e.status).toBe(401);
				done();
			}
		});
	});

	it ('TCRS05 Відправка листа для відновлення пароля на зареєстрований e-mail', (done) => {
		service.restore('v.o.hrytsenko@student.khai.edu').subscribe({
			next: (response) => {
				expect(response.result).toBe('restore_email_sent');
				done();
			},
			error: (e) => {
				fail('Expected success, but got error: ' + e.message);
				done();
			}
		});
	});

	it ('TCRS06 Встановлення нового пароля для користувача', (done) => {
		service.setPassword('EAJMP5p6GXpkV6jD', '123123').subscribe({
			next: (response) => {
				expect(response.result).toBe('password_updated');
				done();
			},
			error: (e) => {
				fail('Expected success, but got error: ' + e.message);
				done();
			}
		});
	});

	it ('TCRS07 Встановлення нового пароля для користувача (ключ не валідний)', (done) => {
		service.setPassword('invalid-key', '123123').subscribe({
			next: () => {
				fail('Expected error, but got success');
				done();
			},
			error: (e) => {
				expect(e.error.error).toBe('key_is_invalid');
				expect(e.status).toBe(400);
				done();
			}
		});
	});
});
