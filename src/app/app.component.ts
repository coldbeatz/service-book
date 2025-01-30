import { Component, inject } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: 'app-root',
	template: '<router-outlet></router-outlet>',
	imports: [
		RouterOutlet
	],
	standalone: true
})
export class AppComponent {

	private translate = inject(TranslateService);

	constructor() {
		this.translate.use('en');
	}
}
