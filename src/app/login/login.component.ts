import { Component, ViewEncapsulation } from '@angular/core';
import { faFacebook, faGooglePlus } from '@fortawesome/free-brands-svg-icons';

@Component({
	selector: 'login-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.scss']
})
export class LoginComponent {

	faFacebook = faFacebook;
	faGoogle = faGooglePlus;
}
