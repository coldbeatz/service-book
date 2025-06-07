import {
	Component,
	ContentChild,
	Input, OnChanges, OnInit, SimpleChanges,
	TemplateRef,
	ViewEncapsulation
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CommonModule } from "@angular/common";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BoldDigitsPipe } from "../../../pipes/bold-digits-pipe";
import { NavigationService } from "../../../services/navigation.service";
import { LocalizationService } from "../../../services/localization.service";

@Component({
	selector: 'left-panel',
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'left-panel.component.html',
	styleUrls: ['left-panel.component.scss'],
	imports: [
		CommonModule,
		BoldDigitsPipe
	],
	standalone: true,
	animations: [
		trigger('collapseExpand', [
			state('collapsed', style({ height: '0px', opacity: 0 })),
			state('expanded', style({ height: '*', opacity: 1 })),
			transition('collapsed <=> expanded', animate('300ms ease')),
		])
	]
})
export class LeftPanelComponent implements OnChanges, OnInit {

	@Input() menuItems: MenuItem[] = [];
	@Input() selectedItemId: string | null = null;

	activeItem: MenuItem | null = null;
	activeParentItem: MenuItem | null = null;

	expandedMap = new Map<string, boolean>();

	@Input() highlightNumbersInSubitems: boolean = false;

	@ContentChild('topContentTemplate', { static: false }) topContentTemplate!: TemplateRef<any>;
	@ContentChild('bottomContentTemplate', { static: false }) bottomContentTemplate!: TemplateRef<any>;

	constructor(private navigationService: NavigationService, private localizationService: LocalizationService) {

	}

	toggleItem(item: MenuItem): void {
		const isOpen = this.expandedMap.get(item.id!) || false;
		this.expandedMap.set(item.id!, !isOpen);

		if (item.routerLink) {
			const commands = Array.isArray(item.routerLink) ? item.routerLink : [item.routerLink];
			this.navigationService.navigate(commands);
			return;
		}

		if (!item.items || !item.items.length) {
			this.setActiveItem(item);
		}
	}

	isExpanded(item: MenuItem): boolean {
		if (!this.expandedMap.has(item.id!)) {
			this.expandedMap.set(item.id!, item.expanded || false);
		}
		return this.expandedMap.get(item.id!)!;
	}

	setActiveItem(item: MenuItem, event?: Event): void {
		this.selectedItemId = item.id || null;
		this.activeItem = item;

		const parentItem = this.menuItems.find(parent => parent.items?.some(subItem => subItem.id === item.id));
		this.activeParentItem = parentItem ?? null;

		if (event) {
			if (item.routerLink) {
				const commands = Array.isArray(item.routerLink) ? item.routerLink : [item.routerLink];

				this.navigationService.navigate(commands);
			} else {
				item.command?.({ originalEvent: event, item: item });
			}
		}
	}

	trackById(index: number, item: MenuItem): string {
		return item.id!;
	}

	private prepareCurrentUrl(): string {
		let currentUrl = this.navigationService.getCurrentUrl();

		let url = currentUrl.split('/');
		if (url.length < 2) return currentUrl;

		if (url[0] === '') {
			url.splice(0, 1);
		}

		if (url[0] === this.localizationService.currentLanguage) {
			url.splice(0, 1);
		}

		return url.join('/');
	}

	private tryActivateMenuItem(): boolean {
		const currentUrl = this.prepareCurrentUrl();

		let matchedItem: MenuItem | undefined;
		for (const item of this.menuItems) {
			console.log(currentUrl, this.navigationService.createUrl(item.routerLink));
			if (item.routerLink && this.navigationService.createUrl(item.routerLink) === currentUrl) {
				matchedItem = item;
				break;
			}

			if (item.items) {
				const subItemMatch = item.items.find(subItem =>
					subItem.routerLink && this.navigationService.createUrl(subItem.routerLink) === currentUrl
				);
				if (subItemMatch) {
					matchedItem = subItemMatch;
					break;
				}
			}
		}

		if (matchedItem) {
			this.setActiveItem(matchedItem);
			return true;
		}

		return false;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.tryActivateMenuItem())
			return;

		if (this.selectedItemId) {
			let selectedItem: MenuItem | undefined = this.menuItems.find(item => this.selectedItemId === item.id);

			if (!selectedItem) {
				selectedItem = this.menuItems
					.map(item => item.items?.find(subItem => subItem.id === this.selectedItemId))
					.find(subItem => subItem !== undefined);
			}

			if (selectedItem) {
				if (!selectedItem.items || !selectedItem.items.length) {
					this.setActiveItem(selectedItem);
				}
			}
		}
	}

	ngOnInit(): void {
		this.tryActivateMenuItem();
	}
}
