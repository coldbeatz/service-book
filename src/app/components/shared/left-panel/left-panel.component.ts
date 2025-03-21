import {
	Component,
	ContentChild,
	Input, OnChanges, SimpleChanges,
	TemplateRef,
	ViewEncapsulation
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CommonModule } from "@angular/common";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BoldDigitsPipe } from "../../../pipes/bold-digits-pipe";

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
export class LeftPanelComponent implements OnChanges {

	@Input() menuItems: MenuItem[] = [];
	@Input() selectedItemId: string | null = null;

	activeItem: MenuItem | null = null;
	activeParentItem: MenuItem | null = null;

	expandedMap = new Map<string, boolean>();

	@Input() highlightNumbersInSubitems: boolean = false;

	@ContentChild('topContentTemplate', { static: false }) topContentTemplate!: TemplateRef<any>;
	@ContentChild('bottomContentTemplate', { static: false }) bottomContentTemplate!: TemplateRef<any>;

	toggleItem(item: MenuItem): void {
		const isOpen = this.expandedMap.get(item.id!) || false;
		this.expandedMap.set(item.id!, !isOpen);

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

		item.command?.({ originalEvent: event, item: item });

		const parentItem = this.menuItems.find(parent => parent.items?.some(subItem => subItem.id === item.id));
		this.activeParentItem = parentItem ?? null;
	}

	trackById(index: number, item: MenuItem): string {
		return item.id!;
	}

	ngOnChanges(changes: SimpleChanges): void {
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
}
