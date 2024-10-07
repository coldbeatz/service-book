import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'service-book';

	constructor(private translate: TranslateService, private router: Router) {
		this.translate.setDefaultLang('en');
		this.translate.use('en');
	}

	ngOnInit(): void {
		/*this.router.navigate(['/login'])
			.then(success => {
				if (success) {
					console.log('Navigation to login successful');
				} else {
					console.error('Navigation to login failed');
				}
			})
			.catch(error => {
				console.error('Error during navigation:', error);
			});*/
	}
}
