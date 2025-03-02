import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "../internal/main/main.component";
import { Card } from "primeng/card";
import { Fieldset } from "primeng/fieldset";
import { News } from "../../models/news.model";
import { NewsService } from "../../services/api/news.service";
import { LocalizationService } from "../../services/localization/localization.service";

@Component({
	selector: 'home-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss'],
	imports: [
		CommonModule,
		MainComponent,
		Card,
		Fieldset
	],
	standalone: true
})
export class HomeComponent implements OnInit {

	news?: News[];

	constructor(private newsService: NewsService,
				protected localizationService: LocalizationService) {

	}

	ngOnInit(): void {
		this.newsService.getNews().subscribe({
			next: (news) => this.news = news.map(n => new News(n))
		})
	}
}
