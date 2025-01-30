import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ApiRequestsService } from "../../../services/api-requests.service";
import { Button } from 'primeng/button';
import { MainComponent } from "../../internal/main/main.component";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { ServiceModalComponent } from "./service-modal/service-modal.component";
import { TranslateModule } from "@ngx-translate/core";

@Component({
	selector: 'services-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'services.component.html',
	styleUrls: ['services.component.scss'],
	imports: [
		MainComponent,
		BreadcrumbComponent,
		Button,
		ServiceModalComponent,
		TranslateModule
	],
	standalone: true
})
export class ServicesComponent implements OnInit {

	products = [
		{ id: 1, name: 'Ноутбук', price: 1200 },
		{ id: 2, name: 'Смартфон', price: 800 },
		{ id: 3, name: 'Наушники', price: 150 },
		{ id: 4, name: 'Клавиатура', price: 100 },
		{ id: 5, name: 'Монитор', price: 300 },
		{ id: 6, name: 'Мышь', price: 50 }
	];

	constructor(private apiRequestsService: ApiRequestsService) {

	}

	ngOnInit(): void {

	}
}
