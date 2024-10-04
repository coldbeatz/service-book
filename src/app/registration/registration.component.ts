import { Component, ViewEncapsulation } from '@angular/core';
import { faFacebook, faGooglePlus } from '@fortawesome/free-brands-svg-icons';

@Component({
	selector: 'registration-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'registration.component.html',
	styleUrls: ['../login/login.component.scss']
})
export class RegistrationComponent {
	faFacebook = faFacebook;
	faGoogle = faGooglePlus;
}
