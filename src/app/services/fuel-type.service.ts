import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FuelType } from "../models/fuel-type.model";

export interface FuelTypeOption {
	value: FuelType;
	label: string;
}

@Injectable({
	providedIn: 'root'
})
export class FuelTypeService {

	options: FuelTypeOption[] = [];

	constructor(private translate: TranslateService) {
		this.initAvailableFuelTypes();
	}

	public getLocalizedFuelType(fuelType: FuelType | null): string {
		const option = this.options.find(option => option.value === fuelType);
		return option ? option.label : (fuelType ? fuelType.toString() : 'null');
	}

	private initAvailableFuelTypes(): void {
		const enumKeys = Object.keys(FuelType)
			.filter(key => isNaN(Number(key)) && key !== "OTHER");

		const translationKeys = enumKeys.map(key => `FUEL_TYPE_${key}`);

		this.translate.get(translationKeys).subscribe((translations: { [key: string]: string }) => {
			this.options = enumKeys.map(key => ({
				value: FuelType[key as keyof typeof FuelType],
				label: translations[`FUEL_TYPE_${key}`]
			}));
		});
	}
}
