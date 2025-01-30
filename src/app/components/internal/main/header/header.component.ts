import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from "../../../../services/auth.service";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
	selector: 'header-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'header.component.html',
	styleUrls: ['header.component.scss'],
	imports: [
		RouterLink,
		TranslateModule
	],
	standalone: true
})
export class HeaderComponent implements OnInit {

	protected bodyLockStatus: boolean = true;

	@ViewChild('menuButton') menuButton!: ElementRef<HTMLInputElement>;

	@ViewChild('header') header!: ElementRef<HTMLElement>;

	constructor(private authService: AuthService) {

	}

	ngOnInit(): void {

	}

	ngAfterViewInit(): void {
		this.menuButton.nativeElement.addEventListener('click', () => {
			if (this.bodyLockStatus) {
				const classList = document.documentElement.classList;

				classList.toggle('lock', !classList.contains('menu-open'));
				classList.toggle('menu-open');

				this.bodyLockStatus = false;
				setTimeout(() => this.bodyLockStatus = true, 500);
			}
		});
	}

	logout(): void {
		this.authService.logout();
	}
}
