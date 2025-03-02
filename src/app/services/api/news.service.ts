import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { News } from "../../models/news.model";

@Injectable({
	providedIn: 'root'
})
export class NewsService {

	private readonly API_URL: string = `${environment.apiUrl}/admin/news`;

	constructor(private http: HttpClient) {

	}

	/**
	 * Отримує список новин
	 *
	 * @returns Observable<News[]>
	 */
	public getNews(): Observable<News[]> {
		return this.http.get<News[]>(`${this.API_URL}`);
	}

	/**
	 * Оновлює або зберігає новину
	 *
	 * @param news Новина
	 *
	 * @returns Observable<News>
	 */
	public saveOrUpdateNews(news: News): Observable<News> {
		const url = this.API_URL;

		return news.id
			? this.http.put<News>(`${url}/${news.id}`, news)
			: this.http.post<News>(url, news);
	}

	/**
	 * Видалити новину
	 *
	 * @param news Новина
	 *
	 * @returns Observable<News>
	 */
	public deleteNews(news: News): Observable<void> {
		const url = `${this.API_URL}/${news.id}`;
		return this.http.delete<void>(url);
	}
}
