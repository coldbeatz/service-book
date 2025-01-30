import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
	selector: 'main-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'main.component.html',
	styleUrls: ['main.component.scss'],
	imports: [
		HeaderComponent,
		FooterComponent
	],
	standalone: true
})
export class MainComponent {

}
