import { Localization } from "./localization.model";
import { Localized } from "../localized.model";

export const LocalizationHandlers: Record<Localization, {
	getValue: (localized: Localized) => string;
	setValue: (localized: Localized, value: string) => void;
}> = {
	[Localization.EN]: {
		getValue: (localized) => localized.en,
		setValue: (localized, value) => { localized.en = value; }
	},
	[Localization.UA]: {
		getValue: (localized) => localized.ua,
		setValue: (localized, value) => { localized.ua = value; }
	}
};
