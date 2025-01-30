import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { NgForOf, NgIf, NgTemplateOutlet } from "@angular/common";

@Component({
	selector: 'app-dropdown',
	templateUrl: 'dropdown.component.html',
	standalone: true,
	imports: [
		NgIf,
		NgTemplateOutlet,
		NgForOf
	],
	styleUrls: ['dropdown.component.scss']
})
export class DropdownComponent<T> {

	@Input() items: T[] = [];
	@Input() selectedItem: T | null = null;
	@Input() placeholder: string = 'Select an item';

	@Input() firstItemText: string | null = null;

	@Input() itemTemplate!: TemplateRef<any>;

	@Output() itemSelected = new EventEmitter<T | null>();

	selectItem(item: T | null): void {
		this.selectedItem = item;
		this.itemSelected.emit(item);
	}
}
