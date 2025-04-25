import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NewsService } from '../../services/api/news.service';
import { AuthInterceptor } from '../../services/auth.interceptor';
import { TranslateModule } from '@ngx-translate/core';
import { News } from '../../models/news.model';
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/api/user.service";
import { loginBeforeTests } from "../test-auth.helper";

describe('NewsService Integration', () => {

	let service: NewsService;

	beforeEach((done) => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				provideHttpClient(withInterceptorsFromDi()),
				NewsService
			]
		});

		service = TestBed.inject(NewsService);

		let authService = TestBed.inject(AuthService);
		let userService = TestBed.inject(UserService);

		loginBeforeTests(userService, authService, done);
	});

	it ('TCNWS01 Отримання доступних новин (видимих звичайному користувачу)', (done) => {
		service.getAvailableWebsiteNews().subscribe({
			next: (newsList) => {
				expect(Array.isArray(newsList)).toBeTrue();
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCNWS02 Отримання усіх новин (адміністратору)', (done) => {
		service.getNews().subscribe({
			next: (newsList) => {
				expect(Array.isArray(newsList)).toBeTrue();
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCNWS03 Створення нової новини', (done) => {
		const newNews = new News();

		newNews.title = { ua: 'Новина UA', en: 'News EN' };
		newNews.content = { ua: 'Контент UA', en: 'Content EN' };

		service.saveOrUpdateNews(newNews).subscribe({
			next: (news) => {
				expect(news).toBeTruthy();
				expect(news.id).toBeGreaterThan(0);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCNWS04 Оновлення наявної новини', (done) => {
		const existingNews = new News();

		existingNews.id = 14;
		existingNews.title = { ua: 'Оновлена новина UA', en: 'Updated News EN' };
		existingNews.content = { ua: 'Оновлений контент UA', en: 'Updated Content EN' };

		service.saveOrUpdateNews(existingNews).subscribe({
			next: (news) => {
				expect(news).toBeTruthy();
				expect(news.id).toBe(existingNews.id);
				done();
			},
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCNWS05 Видалення новини з валідним id', (done) => {
		const newsToDelete = new News();
		newsToDelete.id = 17;

		service.deleteNews(newsToDelete).subscribe({
			next: () => done(),
			error: (e) => {
				fail('Очікувався успіх, але отримано помилку: ' + e.message);
				done();
			}
		});
	});

	it ('TCNWS06 Видалення новини з невалідним id', (done) => {
		const invalidNews = new News();
		invalidNews.id = -1;

		service.deleteNews(invalidNews).subscribe({
			next: () => {
				fail('Очікувалась помилка, але отримано успіх');
				done();
			},
			error: (e) => {
				expect(e.status).toBe(404);
				expect(e.error.error).toBe('entity_not_found');
				done();
			}
		});
	});
});
