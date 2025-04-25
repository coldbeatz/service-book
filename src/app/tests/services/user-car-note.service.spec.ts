import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { loginBeforeTests } from "../test-auth.helper";
import { UserCarNoteService } from "../../services/api/user-car-note.service";
import { TranslateModule } from "@ngx-translate/core";
import { AuthInterceptor } from "../../services/auth.interceptor";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/api/user.service";
import { UserCar } from "../../models/user-car.model";
import { CarNote } from "../../models/car-note.model";

describe('UserCarNoteService Integration', () => {

	let service: UserCarNoteService;

	beforeEach((done) => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				provideHttpClient(withInterceptorsFromDi()),
				UserCarNoteService,
				AuthService,
				UserService
			]
		});

		service = TestBed.inject(UserCarNoteService);

		let authService = TestBed.inject(AuthService);
		let userService = TestBed.inject(UserService);

		loginBeforeTests(userService, authService, done);
	});

	it ('TCUCN01 Отримання нотаток для автомобіля користувача id = 8', (done) => {
		service.getNotes({ id: 8 } as UserCar).subscribe({
			next: (notes) => {
				expect(Array.isArray(notes)).toBeTrue();
				done();
			},
			error: (e) => {
				fail('Expected success, got error: ' + e.message);
				done();
			}
		});
	});

	it ('TCUCN02 Отримання нотатки за id = 12 автомобіля користувача id = 8', (done) => {
		service.getNoteById(12, 8).subscribe({
			next: (note: CarNote) => {
				expect(note).toBeTruthy();
				expect(note.id).toBe(12);
				done();
			},
			error: (e) => {
				fail('Expected success, got error: ' + e.message);
				done();
			}
		});
	});

	it ('TCUCN03 Спроба отримати нотатку id = 1 для чужого автомобіля з id = 3, очікується 403', (done) => {
		service.getNoteById(1, 3).subscribe({
			next: () => {
				fail('Expected access denied error, got success');
				done();
			},
			error: (e) => {
				expect(e.status).toBe(403);
				done();
			}
		});
	});

	it ('TCUCN04 Створення нової нотатки без id', (done) => {
		const note: CarNote = new CarNote({
			userCar: { id: 8 } as UserCar,
			shortDescription: 'New Note',
			content: '<p>Note content</p>'
		});

		service.saveOrUpdateNote(note).subscribe({
			next: (createdNote) => {
				expect(createdNote).toBeTruthy();
				expect(createdNote.id).toBeGreaterThan(0);
				done();
			},
			error: (e) => {
				fail('Expected success, got error: ' + e.message);
				done();
			}
		});
	});

	it ('TCUCN05 Оновлення існуючої нотатки з id = 12', (done) => {
		const note: CarNote = new CarNote({
			id: 12,
			userCar: { id: 8 } as UserCar,
			shortDescription: 'Updated description',
			content: '<p>Updated content</p>'
		});

		service.saveOrUpdateNote(note).subscribe({
			next: (updatedNote) => {
				expect(updatedNote).toBeTruthy();
				expect(updatedNote.id).toBe(12);
				done();
			},
			error: (e) => {
				fail('Expected success, got error: ' + e.message);
				done();
			}
		});
	});

	it ('TCUCN06 Кидання помилки при відсутності userCar', () => {
		const note: CarNote = new CarNote({
			shortDescription: 'Invalid Note',
			content: 'Some content'
		});

		expect(() => service.saveOrUpdateNote(note)).toThrowError('User car is null');
	});

	it ('TCUCN07 Видалення нотатки з id = 13 автомобіля користувача id = 8', (done) => {
		const note: CarNote = new CarNote({
			id: 15,
			userCar: { id: 8 } as UserCar
		});

		service.deleteNote(note).subscribe({
			next: () => done(),
			error: (e) => {
				fail('Expected success, got error: ' + e.message);
				done();
			}
		});
	});

	it ('TCUCN08 Видалення нотатки з неіснуючим id = null, очікується помилка 404', (done) => {
		const note: CarNote = new CarNote({
			id: -1,
			userCar: { id: 8 } as UserCar
		});

		service.deleteNote(note).subscribe({
			next: () => {
				fail('Expected error, got success');
				done();
			},
			error: (e) => {
				expect(e.status).toBe(404);
				done();
			}
		});
	});
});
