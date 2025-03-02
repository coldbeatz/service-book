import { Injectable } from "@angular/core";
import { CarTransmissionType } from "../models/car-transmission-type.model";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";

export interface TransmissionOption {
	value: CarTransmissionType;
	label: string;
}

@Injectable({
	providedIn: 'root'
})
export class CarTransmissionService {

	private optionsSubject = new BehaviorSubject<TransmissionOption[]>([]);
	transmissionOptions$ = this.optionsSubject.asObservable();

	constructor(private translate: TranslateService) {
		this.loadTranslations();
	}

	/**
	 * Ініціалізація доступних варіантів трансмісій з перекладами
	 */
	private loadTranslations(): void {
		const keys = Object.keys(CarTransmissionType).filter(key => isNaN(Number(key)));

		const translationKeys = keys.map(key => `TRANSMISSION_${key}`);

		this.translate.get(translationKeys).subscribe(translations => {
			const options = keys.map(key => ({
				value: CarTransmissionType[key as keyof typeof CarTransmissionType],
				label: translations[`TRANSMISSION_${key}`]
			}));

			this.optionsSubject.next(options);
		});
	}


	/**
	 * Фільтрує доступні трансмісії за списком переданих типів.
	 */
	getOptions(transmissions?: CarTransmissionType[]): TransmissionOption[] {
		const allOptions = this.optionsSubject.value;

		if (!transmissions || transmissions.length === 0) {
			return allOptions;
		}

		return allOptions.filter(option => transmissions.includes(option.value));
	}
}
