import { Localized } from "./localized.model";
import { NewsPostingOption } from "./news-posting-option.model";

export class News {

	/**
	 * Ідентифікатор об'єкта в БД
	 */
	id: number | null;

	/**
	 * Локалізований заголовок новини
	 */
	title: Localized;

	/**
	 * Локалізований контент новини
	 */
	content: Localized;

	/**
	 * Дата відкладеного постингу новини
	 */
	delayedPostingDate: Date | string;

	/**
	 * Типи постингу новин
	 */
	postingOptions: NewsPostingOption[];

	updatedAt: Date | null;
	createdAt: Date | null;

	constructor(news?: Partial<News>) {
		this.id = news?.id ?? null;
		this.title = news?.title ?? { en: '', ua: '' };
		this.content = news?.content ?? { en: '', ua: '' };
		this.delayedPostingDate = news?.delayedPostingDate ? new Date(news.delayedPostingDate) : new Date();
		this.postingOptions = news?.postingOptions ?? [NewsPostingOption.WEBSITE];
		this.updatedAt = news?.updatedAt ? new Date(news.updatedAt) : null;
		this.createdAt = news?.createdAt ? new Date(news.createdAt) : null;
	}

	hasBeenUpdated(): boolean {
		return this.updatedAt?.getTime() !== this.createdAt?.getTime();
	}
}
