import { MenuItem } from "primeng/api";
import { Component, Input, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
	selector: 'left-panel',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './left-panel.component.html',
	styleUrls: ['./left-panel.component.scss'],
	imports: [
		CommonModule
	],
	standalone: true
})
export class LeftPanelComponent {

	@Input() menuItems: MenuItem[] = [];

	@Input() selectedItemId: string | null = null;

	activeItem: MenuItem | null = null;
	activeParentItem: MenuItem | null = null;

	setActiveItem(item: MenuItem, event?: Event): void {
		this.selectedItemId = null;
		this.activeItem = null;

		if (item && item.id) {
			this.activeItem = item;
		}

		item.command?.({
			originalEvent: event,
			item: item
		});

		const parentItem = this.menuItems.find(parent => parent.items?.some(subItem => subItem.id === item.id));
		this.activeParentItem = parentItem ?? null;
	}
}
