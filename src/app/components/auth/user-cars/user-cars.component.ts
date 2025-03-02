import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "../../internal/main/main.component";
import { BreadcrumbComponent } from "../../internal/breadcrumb/breadcrumb.component";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
	selector: 'user-cars-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'user-cars.component.html',
	styleUrls: ['user-cars.component.scss'],
	imports: [
		CommonModule,
		MainComponent,
		BreadcrumbComponent,
		TranslateModule,
		FormsModule,
		RouterLink
	],
	standalone: true
})
export class UserCarsComponent implements OnInit {

	ngOnInit(): void {

	}
}
