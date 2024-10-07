import { Component, ViewEncapsulation } from '@angular/core';
import { faFacebook, faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import {User} from "../user/user";
import {UserService} from "../user/user.service";

@Component({
	selector: 'registration-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'registration.component.html',
	styleUrls: ['../login/login.component.scss']
})
export class RegistrationComponent {
	faFacebook = faFacebook;
	faGoogle = faGooglePlus;

	user: User;

	constructor(private userService: UserService) {
		this.user = new User();
	}

	onSubmit() {
		this.userService.save(this.user);
	}
}
