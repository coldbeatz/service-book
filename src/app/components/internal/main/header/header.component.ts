import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from "../../../../services/auth.service";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NavigationService } from "../../../../services/navigation.service";

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
export class HeaderComponent implements AfterViewInit {

	protected bodyLockStatus: boolean = true;

	@ViewChild('menuButton') menuButton!: ElementRef<HTMLInputElement>;

	@ViewChild('header') header!: ElementRef<HTMLElement>;

	constructor(private authService: AuthService,
				private navigationService: NavigationService) {

	}

	get currentUrl(): string {
		return this.navigationService.getCurrentUrl();
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

		const header = document.querySelector("header.header");
		if (header) {
			window.addEventListener("scroll", () => {
				header.classList.toggle("_header-scroll", window.scrollY >= 1);
			});
		}
	}

	logout(): void {
		this.authService.logout();
		this.closeHeader();
	}

	closeHeader() {
		const classList = document.documentElement.classList;

		classList.remove('lock');
		classList.remove('menu-open');
	}
}
