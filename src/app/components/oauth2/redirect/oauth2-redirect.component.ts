import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../../../services/auth.service";

@Component({
	selector: 'app-oauth2-redirect',
	template: '<p>Redirecting...</p>',
	standalone: true
})
export class Oauth2RedirectComponent implements OnInit {

	constructor(private route: ActivatedRoute, private authService: AuthService) {

	}

	ngOnInit(): void {
		console.log(13123);
		this.route.queryParams.subscribe(params => {
			const token = params['token'];
			const email = params['email'];

			this.authService.login(email, token, false);
		});
	}
}
