import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ApiRequestsService } from "../../../services/api-requests.service";
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'services-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'services.component.html',
	styleUrls: ['services.component.scss'],
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
