import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Editor } from "primeng/editor";
import { DatePicker } from "primeng/datepicker";
import { SelectButton } from "primeng/selectbutton";
import { Dialog } from "primeng/dialog";
import { PrimeTemplate } from "primeng/api";
import { Button } from "primeng/button";
import { NewsPostingOption } from "../../../../models/news-posting-option.model";
import { AutosizeModule } from "ngx-autosize";
import { FloatLabel } from "primeng/floatlabel";
import { Textarea } from "primeng/textarea";
import { News } from "../../../../models/news.model";
import { Localization } from "../../../../models/localization/localization.model";
import { LocalizationHandlers } from "../../../../models/localization/localization-handlers";
import { cloneDeep } from "lodash";
import { NewsService } from "../../../../services/api/news.service";

@Component({
	selector: 'news-editor-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'news-editor.component.html',
	styleUrls: ['news-editor.component.scss'],
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule,
		Editor,
		DatePicker,
		ReactiveFormsModule,
		SelectButton,
		Dialog,
		PrimeTemplate,
		Button,
		AutosizeModule,
		FloatLabel,
		Textarea
	],
	standalone: true
})
export class NewsEditorComponent implements OnInit {

	displayModal: boolean = false;

	/**
	 * Локалізація для заголовка та контенту
	 */
	stateOptions = [
		{ label: 'English', value: Localization.EN },
		{ label: 'Українська', value: Localization.UA }
	];

	selectedTextLocalizationOption: Localization = Localization.EN;

	/**
	 * Типи постингу новин
	 */
	postingOptions = [
		{ name: 'NEWS_EDITOR_POSTING_OPTION_WEBSITE', value: NewsPostingOption.WEBSITE },
		{ name: 'NEWS_EDITOR_POSTING_OPTION_EMAIL', value: NewsPostingOption.EMAIL }
	];

	private _news!: News;

	@Input()
	set news(value: News | null) {
		if (value) {
			this._news = cloneDeep(value);
		} else {
			this._news = new News();
		}
	}

	get news(): News {
		return this._news;
	}

	@Output() onSaved = new EventEmitter<News>();

	constructor(private newsService: NewsService) {
		this.news = new News();
	}

	ngOnInit(): void {

	}

	get localizedTitle(): string {
		return LocalizationHandlers[this.selectedTextLocalizationOption]
			.getValue(this.news.title);
	}

	set localizedTitle(value: string) {
		LocalizationHandlers[this.selectedTextLocalizationOption]
			.setValue(this.news.title, value);
	}

	get localizedContent(): string {
		return LocalizationHandlers[this.selectedTextLocalizationOption]
			.getValue(this.news.content);
	}

	set localizedContent(value: string) {
		LocalizationHandlers[this.selectedTextLocalizationOption]
			.setValue(this.news.content, value);
	}

	openModal() {
		this.displayModal = true;
	}

	closeModal() {
		this.displayModal = false;
	}

	onSaveChangesClick() {
		if (this.news.delayedPostingDate instanceof Date) {
			const time = this.news.delayedPostingDate.getTime();
			const timezoneOffset = this.news.delayedPostingDate.getTimezoneOffset();
			const localDate = new Date(time - timezoneOffset * 60000);

			this.news.delayedPostingDate = localDate.toISOString();
		}

		this.newsService.saveOrUpdateNews(this.news).subscribe({
			next: (news) => {
				this.news = new News(news);
				this.onSaved.emit(this.news);

				this.closeModal();
			}
		})
	}
}
