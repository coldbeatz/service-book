import { Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'alert-root',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'alert.component.html',
    styleUrls: [],
    standalone: true
})
export class AlertComponent {

	@Input() text!: string;

	@Input() type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'success';

	getFormattedText(): string {
		const words = this.text.split(' ');
		if (words.length > 0) {
			words[0] = `<strong>${words[0]}</strong>`;
		}
		return words.join(' ');
	}
}
