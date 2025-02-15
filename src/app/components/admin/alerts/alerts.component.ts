import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "../../internal/main/main.component";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Toast } from "primeng/toast";
import { NewsEditorComponent } from "./news-editor/news-editor.component";
import { ApiRequestsService } from "../../../services/api-requests.service";
import { News } from "../../../models/news.model";
import { DataView } from "primeng/dataview";
import { LocalizationHandlers } from "../../../models/localization/localization-handlers";
import { Tag } from "primeng/tag";
import { NewsPostingOption } from "../../../models/news-posting-option.model";
import { Localization } from "../../../models/localization/localization.model";
import { Button } from "primeng/button";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import { MessageService } from "primeng/api";

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
		TooltipDirective
	],
	standalone: true
})
export class AlertsComponent implements OnInit {

	@ViewChild(NewsEditorComponent) modalComponent!: NewsEditorComponent;

	news?: News[];

	constructor(private apiRequestsService: ApiRequestsService,
				private translateService: TranslateService,
				private messageService: MessageService) {

	}

	ngOnInit(): void {
		this.apiRequestsService.getNews().subscribe({
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

	getTruncatedContent(content: any): string {
		return LocalizationHandlers[Localization.EN].getValue(content);
	}

	deleteNews(news: News) {

	}

	handleNewsSaved(updatedNews: News) {
		if (!this.news) return;

		const index = this.news.findIndex(item => item.id === updatedNews.id);

		if (index >= 0) {
			this.news = this.news.map(item => item.id === updatedNews.id ? updatedNews : item);
		} else {
			this.news = [...this.news, updatedNews];
		}

		const summary = this.translateService.instant('TOAST_SUCCESS');
		const detail = this.translateService.instant('TOAST_SUCCESS_DETAIL');

		this.messageService.add({ severity: 'info', summary: summary, detail: detail });
	}
}
