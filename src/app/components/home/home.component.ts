import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "../internal/main/main.component";
import { Card } from "primeng/card";
import { Fieldset } from "primeng/fieldset";
import { News } from "../../models/news.model";
import { NewsService } from "../../services/api/news.service";
import { LocalizationService } from "../../services/localization/localization.service";
import { DataView } from "primeng/dataview";
import { Button } from "primeng/button";
import { Tag } from "primeng/tag";
import { TooltipDirective } from "ngx-bootstrap/tooltip";
import { Carousel } from "primeng/carousel";

@Component({
	selector: 'home-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss'],
	imports: [
		CommonModule,
		MainComponent,
		Card,
		Carousel
	],
	standalone: true
})
export class HomeComponent implements OnInit {

	news: News[] = [];

	responsiveOptions: any[] | undefined;

	constructor(private newsService: NewsService,
				protected localizationService: LocalizationService) {

	}

	formattedText(text: string): string {
		return text.replace(/&nbsp;/g, " ");
	}

	ngOnInit(): void {
		this.newsService.getAvailableWebsiteNews().subscribe({
			next: (news) => this.news = news.map(n => new News(n))
		});

		this.responsiveOptions = [
			{
				breakpoint: '767px',
				numVisible: 1,
				numScroll: 1,
			}
		];
	}
}
