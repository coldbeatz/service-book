import { Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
	selector: 'alert-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'alert.component.html',
	styleUrls: [],
})
export class AlertComponent {

	@Input() text!: string;

	getFormattedText(): string {
		const words = this.text.split(' ');
		if (words.length > 0) {
			words[0] = `<strong>${words[0]}</strong>`;
		}
		return words.join(' ');
	}
}
