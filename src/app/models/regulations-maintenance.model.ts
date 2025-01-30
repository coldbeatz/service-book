import { Localized } from "./localized.model";

export interface RegulationsMaintenance {
	id: number;
	workDescription: Localized;
	interval: number;
	specificMileage: number;
	useDefault: boolean;
	transmissions: string[];
	fuelTypes: string[];
}
