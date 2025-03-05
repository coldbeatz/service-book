import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef, EventEmitter,
	Input,
	OnDestroy, Output,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink } from "@angular/router";

@Component({
	selector: 'bootstrap-button',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'bootstrap-button.component.html',
	styleUrls: ['bootstrap-button.component.scss'],
	imports: [
		CommonModule,
		TranslateModule,
		RouterLink
	],
	standalone: true
})
export class BootstrapButtonComponent implements AfterViewInit, OnDestroy {

	/**
	 * Текст кнопки
	 */
	@Input() text!: string;

	/**
	 * Посилання для переходу
	 */
	@Input() routerLink: string | any[] = [];

	/**
	 * Максимальна ширина кнопки
	 */
	@Input() maxWidth: number = 300;

	/**
	 * Іконка Bootstrap
	 */
	@Input() bootstrapIconId?: string;

	@Input() type: 'primary' | 'danger' = 'primary';

	@Input() disabled: boolean = false;

	@Output() click = new EventEmitter<void>();

	@ViewChild('buttonElement', { static: false }) buttonElement!: ElementRef<HTMLAnchorElement>;

	isCompact = false;

	private resizeObserver!: ResizeObserver;

	constructor(private cdr: ChangeDetectorRef) {

	}

	ngAfterViewInit(): void {
		this.initResizeObserver();
		this.checkButtonWidth();
	}

	ngOnDestroy(): void {
		this.resizeObserver?.disconnect();
	}

	private initResizeObserver(): void {
		this.resizeObserver = new ResizeObserver(() => this.checkButtonWidth());
		this.resizeObserver.observe(this.buttonElement.nativeElement);
	}

	private checkButtonWidth(): void {
		const width = this.buttonElement.nativeElement.offsetWidth;
		this.isCompact = width < 200;
		this.cdr.detectChanges();
	}

	handleClick(event: MouseEvent): void {
		// Щоб не спрацював перехід по routerLink, якщо це треба
		event.preventDefault();

		this.click.emit();
	}
}
