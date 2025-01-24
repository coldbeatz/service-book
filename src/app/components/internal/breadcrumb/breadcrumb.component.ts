import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

interface BreadcrumbItem {
	label: string;
	url?: string; // URL необов'язковий для останнього елемента
}

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss'],
	imports: [
		CommonModule, RouterLink
	],
	standalone: true
})
export class BreadcrumbComponent {

	@Input() items: BreadcrumbItem[] = [];
}
