import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'header-root',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'header.component.html',
	styleUrls: ['header.component.scss'],
})
export class HeaderComponent implements OnInit {

	protected bodyLockStatus: boolean = true;

	@ViewChild('menuButton') menuButton!: ElementRef<HTMLInputElement>;

	@ViewChild('header') header!: ElementRef<HTMLElement>;

	constructor(private elementRef: ElementRef) {

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
}
