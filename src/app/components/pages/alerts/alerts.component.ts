import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Toast } from "primeng/toast";
import { NewsEditorComponent } from "./news-editor/news-editor.component";
import { News } from "../../../models/news.model";
import { DataView } from "primeng/dataview";
import { LocalizationHandlers } from "../../../models/localization/localization-handlers";
import { Tag } from "primeng/tag";
import { NewsPostingOption } from "../../../models/news-posting-option.model";
import { Localization } from "../../../models/localization/localization.model";
import { Button } from "primeng/button";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import { ConfirmationService, MenuItem, PrimeIcons } from "primeng/api";
import { NewsService } from "../../../services/api/news.service";
import { ConfirmDialog } from "primeng/confirmdialog";
import { AlertComponent } from "../../shared/alert/alert.component";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { LocalizationService } from "../../../services/localization.service";
import { BootstrapButtonComponent } from "../../shared/button/bootstrap-button.component";
import { LeftPanelComponent } from "../../shared/left-panel/left-panel.component";
import { MainComponent } from "../../shared/main/main.component";

enum NewsSuccessType {
	NEWS_SAVED,
	NEWS_DELETED
}

@Component({
	selector: 'alerts-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'alerts.component.html',
	styleUrls: ['alerts.component.scss'],
	imports: [
		CommonModule,
		MainComponent,
		BreadcrumbComponent,
		TranslateModule,
		Toast,
		NewsEditorComponent,
		DataView,
		Tag,
		Button,
		TooltipDirective,
		ConfirmDialog,
		AlertComponent,
		DropdownModule,
		FormsModule,
		BootstrapButtonComponent,
		LeftPanelComponent
	],
	standalone: true
})
export class AlertsComponent implements OnInit {

	@ViewChild(NewsEditorComponent) modalComponent!: NewsEditorComponent;

	news: News[] = [];

	protected readonly NewsSuccessType = NewsSuccessType;
	successType: NewsSuccessType | null = null;

	constructor(private newsService: NewsService,
				private translateService: TranslateService,
				protected localizationService: LocalizationService,
				private confirmationService: ConfirmationService) {

	}

	selectedSort: string = 'newest';

	sortOptions = [
		{ label: 'NEWS_SORT_NEWEST', value: 'newest' },
		{ label: 'NEWS_SORT_OLDEST', value: 'oldest' },
		{ label: 'NEWS_SORT_NEWEST_UPDATE', value: 'newest_update' }
	];

	get menuItems(): MenuItem[] {
		return [
			{
				label: this.translateService.instant("NEWS_LIST"),
				id: 'news',
				expanded: true,
				items: [
					{
						label: this.translateService.instant("NEWS_CREATE_BUTTON"),
						id: 'create_news',
						icon: PrimeIcons.PLUS,
						command: () => {
							this.onClickEditNews(null);
						}
					},
					...this.sortedNews.map(item => ({
						label: LocalizationHandlers[Localization.EN].getValue(item.title) || this.translateService.instant("NEWS_NO_TITLE"),
						id: `news_${item.id}`,
						icon: PrimeIcons.PENCIL,
						command: () => {
							this.onClickEditNews(item);
						}
					}))
				]
			}
		];
	}

	get sortedNews(): News[] {
		if (!this.news)
			return [];

		return [...this.news].sort((a, b) => {
			switch (this.selectedSort) {
				case 'newest':
					return new Date(b.delayedPostingDate).getTime() - new Date(a.delayedPostingDate).getTime();
				case 'oldest':
					return new Date(a.delayedPostingDate).getTime() - new Date(b.delayedPostingDate).getTime();
				case 'newest_update':
					return (new Date(b.updatedAt ?? 0).getTime()) - (new Date(a.updatedAt ?? 0).getTime());
				default:
					return 0;
			}
		});
	}

	ngOnInit(): void {
		this.newsService.getNews().subscribe({
			next: (news) => this.news = news.map(n => new News(n))
		})
	}

	onClickEditNews(news: News | null): void {
		if (this.modalComponent) {
			this.modalComponent.news = news;
			this.modalComponent.openModal();
		}
	}

	getPostingLabel(option: NewsPostingOption): string {
		const labels = {
			[NewsPostingOption.WEBSITE]: 'Website',
			[NewsPostingOption.EMAIL]: 'E-mail'
		};
		return labels[option] || 'Unknown';
	}

	deleteNews(newsToBeDelete: News) {
		this.successType = null;

		this.confirmationService.confirm({
			accept: () => {
				this.newsService.deleteNews(newsToBeDelete).subscribe({
					next: () => {
						this.successType = NewsSuccessType.NEWS_DELETED;

						if (this.news) {
							this.news = this.news.filter(n => n.id !== newsToBeDelete.id);
						}
					}
				});
			}
		});
	}

	formattedText(text: string): string {
		return text.replace(/&nbsp;/g, " ");
	}

	handleNewsSaved(updatedNews: News) {
		this.successType = null;

		if (!this.news) return;

		const index = this.news.findIndex(item => item.id === updatedNews.id);

		if (index >= 0) {
			this.news = this.news.map(item => item.id === updatedNews.id ? updatedNews : item);
		} else {
			this.news = [...this.news, updatedNews];
		}

		this.successType = NewsSuccessType.NEWS_SAVED;
	}
}
