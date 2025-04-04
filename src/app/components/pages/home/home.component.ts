import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Card } from "primeng/card";
import { News } from "../../../models/news.model";
import { NewsService } from "../../../services/api/news.service";
import { LocalizationService } from "../../../services/localization.service";
import { Carousel } from "primeng/carousel";
import { MainComponent } from "../../shared/main/main.component";

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
